# 🤖 AI Policy Chatbot

A modern AI chatbot web application that integrates with Azure AI Foundry for intelligent conversations.

![Chatbot Interface](https://img.shields.io/badge/UI-Modern%20Chat%20Interface-blue)
![Azure](https://img.shields.io/badge/Azure-AI%20Foundry-0078d4)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## ✨ Features

- 💬 **Real-time Chat Interface** - Modern, responsive design
- 🤖 **Azure AI Integration** - Powered by Azure AI Foundry
- 📱 **Mobile Friendly** - Works on all devices  
- 🔒 **Secure** - Built with security best practices
- ⚡ **Fast** - Optimized performance
- 🔄 **Conversation Memory** - Maintains context

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

## 🔒 Security

- Environment variables for secure credential storage
- Helmet.js for security headers
- Input validation and sanitization
- CORS configuration
- Rate limiting protection

## 🎨 Customization

- **UI Styling**: Edit `public/styles.css`
- **AI Behavior**: Modify system prompts in `src/server.js`
- **Features**: Add new endpoints and functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- 📖 [Configuration Guide](CONFIGURATION.md)
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md)
- 🐛 [Issues](https://github.com/yourusername/PolicyChatbotPOC/issues)
- 💬 [Discussions](https://github.com/yourusername/PolicyChatbotPOC/discussions)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**⭐ Star this repo if you find it helpful!**
