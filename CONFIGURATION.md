# 🔧 Configuration Guide

This guide will help you configure the AI Policy Chatbot POC with Azure AI Foundry and optional Azure AI Search integration.

## 📋 Required Configuration

Copy `.env.example` to `.env` and update these values:

### Azure AI Foundry Settings (Required)

```env
AZURE_AI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_AI_API_KEY=your-api-key-here
```

### Azure AI Search Settings (Optional - for knowledge base)

```env
AZURE_SEARCH_ENDPOINT=https://your-search.search.windows.net
AZURE_SEARCH_INDEX=your-search-index-name-here
AZURE_SEARCH_API_KEY=your-azure-search-api-key-here
```

### Application Settings (Optional)

```env
PORT=3000
NODE_ENV=production
```

## 🔍 How to Find Your Azure AI Foundry Credentials

### Step 1: Access Azure AI Foundry

1. Visit: https://ai.azure.com
2. Sign in with your Azure account
3. Navigate to your project

### Step 2: Find Your Endpoint

1. In your project, go to **"Models + endpoints"** → **"Your deployed model"**
2. Copy the **"Target URI"** (this is your `AZURE_AI_ENDPOINT`)
3. Example: `https://your-resource.openai.azure.com`

### Step 3: Find Your API Key

1. Go to **"Models + endpoints"** → **"Your deployed model"**
2. Copy the **"Key"** (this is your `AZURE_AI_API_KEY`)
3. Keep this secure - never share or commit to version control

### Step 4: Verify Your Model Deployment

1. Go to **"Deployments"**
2. Ensure you have a **GPT-4.1** model deployed
3. Note the deployment name (currently configured as "gpt-4.1" in the code)

## 🔎 Azure AI Search Configuration (Optional)

If you want to enable knowledge base search capabilities:

### Step 1: Create Azure AI Search Service

1. Go to Azure Portal: https://portal.azure.com
2. Create a new **"Azure AI Search"** resource
3. Choose appropriate pricing tier

### Step 2: Get Search Credentials

1. In your Search service, go to **"Keys"**
2. Copy the **"URL"** (this is your `AZURE_SEARCH_ENDPOINT`)
3. Copy the **"Primary admin key"** (this is your `AZURE_SEARCH_API_KEY`)

### Step 3: Create and Configure Index

1. Create a search index with your documents
2. Note the index name (this is your `AZURE_SEARCH_INDEX`)
3. Ensure your documents are properly indexed

## 🛠️ Setup Methods

### Method 1: Interactive Setup (Recommended)

```bash
npm run setup
```

This will guide you through the configuration process step by step.

### Method 2: Manual Configuration

```bash
# Copy the template
cp .env.example .env

# Edit with your favorite editor
notepad .env
# or
code .env
```

## ⚠️ Important Security Notes

- **API Key Security**: Keep your API keys secure and never commit them to version control
- **Environment File**: The `.env` file is already in `.gitignore` for security
- **Model Deployment**: If you change your deployment name from "gpt-4.1", update it in `src/server.js`
- **Access Control**: Use Azure role-based access control (RBAC) to limit API access
- **Rate Limits**: Be aware of Azure AI service rate limits and quotas

## 🔧 Configuration Validation

### Test Your Configuration

1. Run the application: `npm run dev`
2. Check the health endpoint: `http://localhost:3000/api/health`
3. Verify the console shows no credential errors
4. Test a simple chat message

### Common Issues

- **401 Unauthorized**: Check your API key and endpoint
- **404 Not Found**: Verify your model deployment name
- **429 Rate Limited**: Check your Azure quotas
- **Timeout Errors**: Verify network connectivity to Azure

## 🌐 Environment-Specific Configuration

### Development Environment

```env
NODE_ENV=development
PORT=3000
```

### Production Environment

```env
NODE_ENV=production
PORT=80
```

### Azure App Service

When deploying to Azure App Service, configure these in the Application Settings:

- Don't use a `.env` file in production
- Set environment variables directly in Azure Portal
- Use Azure Key Vault for sensitive values

## 📊 Monitoring & Logging

Enable comprehensive monitoring by:

1. Setting up Azure Application Insights
2. Configuring log analytics workspace
3. Monitoring API usage and costs
4. Setting up alerts for errors and rate limits

## 🚀 Quick Start Checklist

- [ ] 1. **Install Dependencies**: Run `npm install`
- [ ] 2. **Copy Environment File**: `cp .env.example .env`
- [ ] 3. **Configure Azure AI Foundry**: Add endpoint and API key
- [ ] 4. **Optional - Configure Azure AI Search**: Add search credentials
- [ ] 5. **Test Configuration**: Run `npm run dev`
- [ ] 6. **Verify Health**: Check `http://localhost:3000/api/health`
- [ ] 7. **Test Chat**: Open `http://localhost:3000` and send a message

## 🔗 Useful Links

- [Azure AI Foundry Studio](https://ai.azure.com)
- [Azure Portal](https://portal.azure.com)
- [Azure AI Foundry Documentation](https://docs.microsoft.com/azure/ai-foundry/)
- [Azure AI Search Documentation](https://docs.microsoft.com/azure/search/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 💡 Tips for Success

1. **Start Simple**: Configure just Azure AI Foundry first, add Search later
2. **Test Incrementally**: Verify each configuration step before proceeding
3. **Monitor Usage**: Keep track of API calls and costs
4. **Backup Configuration**: Document your settings for easy restoration
5. **Use Version Control**: Track configuration changes (except sensitive data)
