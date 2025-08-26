# 🤖 AI Policy Chatbot

An AI chatbot web application that integrates with Azure AI Foundry.

![Azure](https://img.shields.io/badge/Azure-AI%20Foundry-0078d4)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/PolicyChatbotPOC.git
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
- Azure App Service (for production deployment)

## 🔧 Configuration

You need these Azure AI Foundry credentials:

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_AI_ENDPOINT` | Your AI Foundry endpoint | `https://your-resource.openai.azure.com` |
| `AZURE_AI_API_KEY` | Your API key | `abc123...` |
| `AZURE_SEARCH_ENDPOINT` | Your AI Search Service URL | `https://your-resource.openai.azure.com`
| `AZURE_SEARCH_INDEX` | Your index name | `azuredocs`
| `AZURE_SEARCH_API_KEY` | Your API key | `abc123...`

**Need help finding these?** See [CONFIGURATION.md](CONFIGURATION.md) for detailed instructions.

## 🌐 Deployment

### Azure App Service

1. **Create App Service** with Node.js runtime
2. **Set Environment Variables** in Azure Portal
3. **Deploy Code** via GitHub Actions, Azure DevOps, or direct upload

For detailed deployment instructions, see the [deployment section](docs/DEPLOYMENT.md).

## 📁 Project Structure

```
├── 📂 src/              # Application source code
│   └── server.js        # Main Express.js server
├── 📂 public/           # Frontend assets (HTML, CSS, JS)
├── 📂 config/           # Configuration files
├── 📂 scripts/          # Setup and utility scripts
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🎨 Customization

- **UI Styling**: Edit `public/styles.css`
- **AI Behavior**: Modify system prompts in `src/server.js`
