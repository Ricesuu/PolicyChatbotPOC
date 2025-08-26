const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Azure AI Foundry configuration
const AZURE_AI_ENDPOINT = process.env.AZURE_AI_ENDPOINT;
const AZURE_AI_API_KEY = process.env.AZURE_AI_API_KEY;

// Validate required environment variables
if (!AZURE_AI_ENDPOINT || !AZURE_AI_API_KEY) {
  console.error('Missing required environment variables: AZURE_AI_ENDPOINT and AZURE_AI_API_KEY');
  process.exit(1);
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation_history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Prepare the conversation for Azure AI Foundry
    const messages = [
      {
        role: 'system',
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

Remember: If you don't have search results or the search results don't answer the question, always respond with the "I don't have information" message.`
      },
      ...conversation_history,
      {
        role: 'user',
        content: message
      }
    ];

    // Prepare request body
    const requestBody = {
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    // Add Azure AI Search integration if configured
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
              key: AZURE_SEARCH_API_KEY
            }
          }
        }
      ];
    }

    // Call Azure AI Foundry API
    const response = await axios.post(
      `${AZURE_AI_ENDPOINT}/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_AI_API_KEY
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    res.json({
      response: aiResponse,
      conversation_id: Date.now().toString()
    });

  } catch (error) {
    console.error('Error calling Azure AI Foundry:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid API key or unauthorized access' });
    } else if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Request timeout. Please try again.' });
    } else {
      res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: require('../package.json').version
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});

module.exports = app;
