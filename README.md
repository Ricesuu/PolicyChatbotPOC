# 🤖 AI Policy Chatbot POC

An AI chatbot web application that uses Azure AI Foundry.

## ✨ Features

- 🤖 **Azure AI Integration** - Powered by Azure AI Foundry with GPT-4.1 model
- 🔍 **Knowledge Base Search** - Integrated Azure AI Search for document-based responses

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Ricesuu/PolicyChatbotPOC.git
cd PolicyChatbotPOC
npm install
```

### 2. Configure (Choose one method)

**Option A: Setup Assistant**

```bash
npm run setup
```

**Option B: Manual Configuration**

```bash
cp .env.example .env
# Edit .env with your Azure AI Foundry credentials
```

### 3. Run

```bash
# Development
npm run dev

# Production
npm start
```

### 4. Open Browser

Navigate to `http://localhost:3000`

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- Azure AI Foundry account with deployed model
- Azure AI Search service (optional, for knowledge base integration)
- Azure App Service (for production deployment)

## 🔧 Configuration

You need these Azure AI Foundry credentials:

| Variable                | Description                           | Example                                  |
| ----------------------- | ------------------------------------- | ---------------------------------------- |
| `AZURE_AI_ENDPOINT`     | Your AI Foundry endpoint              | `https://your-resource.openai.azure.com` |
| `AZURE_AI_API_KEY`      | Your API key                          | `abc123...`                              |
| `AZURE_SEARCH_ENDPOINT` | Your AI Search Service URL (optional) | `https://your-search.search.windows.net` |
| `AZURE_SEARCH_INDEX`    | Your search index name (optional)     | `knowledge-base`                         |
| `AZURE_SEARCH_API_KEY`  | Your search API key (optional)        | `xyz789...`                              |
| `PORT`                  | Server port (optional)                | `3000`                                   |
| `NODE_ENV`              | Environment mode (optional)           | `production`                             |

See [CONFIGURATION.md](CONFIGURATION.md) for detailed instructions.

## 🌐 Deployment

### Azure App Service

1. **Create App Service** with Node.js runtime
2. **Set Environment Variables** in Azure Portal
3. **Deploy Code** via GitHub Actions, Azure DevOps, or direct upload

For detailed deployment instructions, see the [deployment section](docs/DEPLOYMENT.md).

## 📁 Project Structure

```
├── 📂 src/              # Application source code
│   └── server.js        # Main Express.js server with Azure AI integration
├── 📂 public/           # Frontend assets (HTML, CSS, JS)
│   ├── index.html       # Main chat interface
│   ├── styles.css       # UI styling
│   └── script.js        # Client-side chat functionality
├── 📂 config/           # Configuration files
│   └── web.config       # Deployment configuration
├── 📂 scripts/          # Setup and utility scripts
│   ├── setup.js         # Interactive setup wizard
│   └── install.bat      # Windows installation script
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
├── web.config           # Azure App Service configuration
├── CONFIGURATION.md     # Detailed setup instructions
└── README.md           # This file
```

## 🤖 AI Configuration

The chatbot is configured with:

- **Model**: GPT-4.1 via Azure AI Foundry
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 1000 per response
- **Knowledge Mode**: Strict document-based responses only
- **Search Integration**: Azure AI Search for knowledge retrieval

## 🎨 Customization

- **UI Styling**: Edit `public/styles.css` for visual customization
- **AI Behavior**: Modify system prompts in `src/server.js`
- **Search Configuration**: Update Azure AI Search parameters
- **Model Settings**: Change temperature, max tokens, and other AI parameters

## 🚀 Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run setup      # Interactive configuration
npm run build      # Production build (install dependencies)
```

### Local Development

1. Ensure all environment variables are configured
2. Run `npm run dev` for hot-reload development
3. Access the application at `http://localhost:3000`
4. Check health status at `http://localhost:3000/api/health`
