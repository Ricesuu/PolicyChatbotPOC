# AI Policy Chatbot POC

A modern AI chatbot web application built for Azure App Service that integrates with Azure AI Foundry.

## Features

- 🤖 **AI-Powered Conversations**: Integrates with Azure AI Foundry for intelligent responses
- 💬 **Real-time Chat Interface**: Modern, responsive chat UI with typing indicators
- 🔒 **Secure**: Built with security best practices using Helmet.js
- 📱 **Mobile-Friendly**: Responsive design that works on all devices
- ⚡ **Fast**: Optimized Express.js backend with efficient API calls
- 🔄 **Conversation Memory**: Maintains context across the conversation
- 📊 **Health Monitoring**: Built-in health check endpoint

## Prerequisites

- Node.js 18.0.0 or higher
- Azure AI Foundry account with API access
- Azure App Service (for deployment)

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PolicyChatbotPOC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the environment variables:
     ```env
     AZURE_AI_ENDPOINT=https://your-endpoint.openai.azure.com
     AZURE_AI_API_KEY=your-api-key-here
     PORT=3000
     NODE_ENV=development
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Azure Deployment

### Using Azure App Service

1. **Create an Azure App Service**
   - Choose Node.js as the runtime stack
   - Select appropriate pricing tier

2. **Configure Application Settings**
   In the Azure Portal, add these application settings:
   - `AZURE_AI_ENDPOINT`: Your Azure AI Foundry endpoint
   - `AZURE_AI_API_KEY`: Your Azure AI Foundry API key
   - `NODE_ENV`: production

3. **Deploy the code**
   - Use Azure DevOps, GitHub Actions, or direct deployment
   - Ensure all files including `web.config` are deployed

### Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name myResourceGroup --location "East US"

# Create App Service plan
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux

# Create web app
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myAIChatbot --runtime "NODE|18-lts"

# Configure app settings
az webapp config appsettings set --resource-group myResourceGroup --name myAIChatbot --settings AZURE_AI_ENDPOINT="your-endpoint" AZURE_AI_API_KEY="your-api-key" NODE_ENV="production"

# Deploy code
az webapp deployment source config --resource-group myResourceGroup --name myAIChatbot --repo-url <your-git-repo> --branch main --manual-integration
```

## API Endpoints

### POST `/api/chat`
Send a message to the AI chatbot.

**Request Body:**
```json
{
  "message": "Hello, how can you help me?",
  "conversation_history": []
}
```

**Response:**
```json
{
  "response": "Hello! I'm here to help...",
  "conversation_id": "1234567890"
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AZURE_AI_ENDPOINT` | Azure AI Foundry endpoint URL | Yes |
| `AZURE_AI_API_KEY` | Azure AI Foundry API key | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

### Azure AI Foundry Setup

1. Create an Azure AI Foundry resource
2. Deploy a GPT model (e.g., GPT-4)
3. Get the endpoint URL and API key
4. Update the deployment name in `server.js` if different from "gpt-4"

## Project Structure

```
PolicyChatbotPOC/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styles
│   └── script.js           # Frontend JavaScript
├── server.js               # Express.js server
├── package.json            # Node.js dependencies
├── web.config              # IIS configuration for Azure
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Security Features

- **Helmet.js**: Security headers and protection
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Message validation and sanitization
- **Rate Limiting**: Built-in protection against abuse
- **Environment Variables**: Secure credential management

## Customization

### Modifying the AI Behavior
Edit the system message in `server.js`:
```javascript
{
  role: 'system',
  content: 'You are a helpful AI assistant specialized in policy questions...'
}
```

### Styling
Modify `public/styles.css` to change the appearance of the chat interface.

### Adding Features
- Conversation persistence
- User authentication
- File upload support
- Multi-language support

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your Azure AI API key and endpoint
2. **CORS Errors**: Ensure the frontend is served from the same domain
3. **500 Server Error**: Check server logs for detailed error messages
4. **Deployment Issues**: Verify all environment variables are set in Azure

### Logs

In Azure App Service, check the logs:
- Navigate to your App Service in Azure Portal
- Go to "Log stream" or "App Service logs"
- Enable application logging for detailed information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section
- Review Azure AI Foundry documentation
- Create an issue in the repository
