const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000; // Server port (defaults to 3000 if PORT env var not set)

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only allow resources from the same origin
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"], // Allow styles from self, inline styles, and CDN
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from self and inline scripts
        imgSrc: ["'self'", "data:", "https:"], // Allow images from self, data URIs, and HTTPS
        connectSrc: ["'self'"], // Allow connections (AJAX, WebSockets) to same origin only
      },
    },
  })
);
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" })); // Maximum request body size (increase for larger messages, decrease for security)
app.use(express.static(path.join(__dirname, "..", "public")));

// Azure AI Foundry configuration
const AZURE_AI_ENDPOINT = process.env.AZURE_AI_ENDPOINT;
const AZURE_AI_API_KEY = process.env.AZURE_AI_API_KEY;

// Validate required environment variables
if (!AZURE_AI_ENDPOINT || !AZURE_AI_API_KEY) {
  console.error(
    "Missing required environment variables: AZURE_AI_ENDPOINT and AZURE_AI_API_KEY"
  );
  process.exit(1);
}

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversation_history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Message is required and must be a string" });
    }

    // Prepare the conversation for Azure AI Foundry
    const messages = [
      {
        role: "system",
        // System message defines the AI assistant's behavior and response guidelines
        // Modify this content to change how the AI responds to user queries
        // Key aspects you can customize:
        // - Response strictness (knowledge base only vs general knowledge)
        // - Error message when no information is found
        // - Formatting preferences (bold text, bullet points, etc.)
        // - Citation requirements
        content: `You are a strict knowledge base assistant that ONLY answers questions using information from the provided search results. You must NOT use your general knowledge or training data.

CRITICAL RULES:
- ONLY respond if the answer is found in the search results provided to you
- If NO search results are provided, or if the search results don't contain relevant information, you MUST respond with: "I don't have information about that topic in my knowledge base. Please ask about topics that are covered in the available documents."
- NEVER use your general AI knowledge to answer questions
- NEVER make up or infer information not explicitly stated in the search results

RESPONSE FORMATTING (only when you have relevant search results):
- For simple greetings: respond naturally and briefly
- For factual questions: use clear formatting with **bold** for emphasis when helpful
- Use bullet points (- item) for lists when appropriate
- Keep responses conversational but stick strictly to the search results
- Do not include citation references like [doc1] or [doc2]

Remember: If you don't have search results or the search results don't answer the question, always respond with the "I don't have information" message.`,
      },
      ...conversation_history,
      {
        role: "user",
        content: message,
      },
    ];

    // Prepare request body with AI model parameters
    // max_tokens: Maximum number of tokens in the response (higher = longer responses, but more expensive)
    // temperature: Controls randomness (0.0 = deterministic, 1.0 = very random, 0.7 = balanced creativity)
    // top_p: Nucleus sampling parameter (0.1 = conservative, 0.9 = diverse, 0.95 = good balance)
    // frequency_penalty: Reduces repetition of frequent tokens (0 = no penalty, 2.0 = strong penalty)
    // presence_penalty: Reduces repetition of any tokens (0 = no penalty, 2.0 = strong penalty)
    const requestBody = {
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    // Add Azure AI Search integration if configured
    // This enables the AI to search through your knowledge base documents
    // Requires: AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_INDEX, AZURE_SEARCH_API_KEY environment variables
    const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT;
    const AZURE_SEARCH_INDEX = process.env.AZURE_SEARCH_INDEX;
    const AZURE_SEARCH_API_KEY = process.env.AZURE_SEARCH_API_KEY;

    if (AZURE_SEARCH_ENDPOINT && AZURE_SEARCH_INDEX && AZURE_SEARCH_API_KEY) {
      requestBody.data_sources = [
        {
          type: "azure_search",
          parameters: {
            endpoint: AZURE_SEARCH_ENDPOINT,
            index_name: AZURE_SEARCH_INDEX,
            authentication: {
              type: "api_key",
              key: AZURE_SEARCH_API_KEY,
            },
          },
        },
      ];
    }

    // Call Azure AI Foundry API - Direct Model Endpoint
    const response = await axios.post(
      AZURE_AI_ENDPOINT, // Direct model endpoint URL
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AZURE_AI_API_KEY}`, // Bearer token for direct model endpoints
        },
        timeout: 30000, // Request timeout in milliseconds (30 seconds)
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    res.json({
      response: aiResponse,
      conversation_id: Date.now().toString(), // Unique identifier for this conversation turn
    });
  } catch (error) {
    console.error(
      "Error calling Azure AI Foundry:",
      error.response?.data || error.message
    );

    // Handle different types of API errors with appropriate HTTP status codes
    if (error.response?.status === 401) {
      // 401 Unauthorized: Invalid API key or authentication failure
      res.status(401).json({ error: "Invalid API key or unauthorized access" });
    } else if (error.response?.status === 429) {
      // 429 Too Many Requests: Rate limit exceeded
      res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    } else if (error.code === "ECONNABORTED") {
      // Request timeout: Connection or API response took too long
      res.status(408).json({ error: "Request timeout. Please try again." });
    } else {
      // 500 Internal Server Error: Generic server error for unhandled cases
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: require("../package.json").version,
  });
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});

module.exports = app;
