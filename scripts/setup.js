const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 Azure AI Chatbot Setup Assistant\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setup() {
  try {
    console.log('This script will help you configure your environment variables.\n');
    
    // Check if .env already exists
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const overwrite = await askQuestion('.env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }

    console.log('Please provide your Azure AI Foundry credentials:\n');
    
    const endpoint = await askQuestion('Azure AI Endpoint (e.g., https://your-resource.openai.azure.com): ');
    const apiKey = await askQuestion('Azure AI API Key: ');
    const port = await askQuestion('Port (default 3000): ') || '3000';
    const nodeEnv = await askQuestion('Environment (development/production, default development): ') || 'development';

    // Validate inputs
    if (!endpoint || !apiKey) {
      console.log('\n❌ Error: Endpoint and API Key are required!');
      rl.close();
      return;
    }

    if (!endpoint.startsWith('https://')) {
      console.log('\n⚠️  Warning: Endpoint should start with https://');
    }

    // Create .env content
    const envContent = `# Environment Variables
AZURE_AI_ENDPOINT=${endpoint}
AZURE_AI_API_KEY=${apiKey}
PORT=${port}
NODE_ENV=${nodeEnv}

# Azure AI Search (optional - for knowledge base integration)
# AZURE_SEARCH_ENDPOINT=your-search-service-endpoint
# AZURE_SEARCH_INDEX=your-index-name
# AZURE_SEARCH_API_KEY=your-search-api-key
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Configuration saved to .env file!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Run: npm install');
    console.log('   2. Run: npm run dev');
    console.log('   3. Open: http://localhost:' + port);
    console.log('\n📖 For more information, see CONFIGURATION.md');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
  }
  
  rl.close();
}

setup();
