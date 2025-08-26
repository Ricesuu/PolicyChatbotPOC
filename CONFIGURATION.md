# 🔧 Configuration Guide

## Required Configuration

Copy `.env.example` to `.env` and update these values:

### Azure AI Foundry Settings
```env
AZURE_AI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_AI_API_KEY=your-api-key-here
```

### Optional Settings
```env
PORT=3000
NODE_ENV=development
```

## How to Find Your Azure AI Foundry Credentials

1. **Go to Azure AI Foundry Studio**
   - Visit: https://ai.azure.com

2. **Find Your Endpoint**
   - Navigate to your project
   - Go to "Settings" → "General"
   - Copy the "Target URI" (this is your endpoint)

3. **Find Your API Key**
   - Go to "Settings" → "Connection"
   - Copy the "Primary key"

4. **Find Your Deployment Name**
   - Go to "Deployments"
   - Note the name of your model deployment (e.g., "gpt-4", "gpt-35-turbo")

## ⚠️ Important Notes

- Keep your API keys secure and never commit them to version control
- The `.env` file is already in `.gitignore` for security
- If you change your deployment name, update it in `src/server.js`

## 🚀 Quick Start

1. Run `npm install` to install dependencies
2. Copy and configure your `.env` file
3. Run `npm run dev` to start development server
4. Open http://localhost:3000
