class ChatBot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.characterCount = document.getElementById('characterCount');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        this.conversationHistory = [];
        this.isLoading = false;
        
        this.init();
    }

    init() {
        // Set initial timestamp
        document.getElementById('initialTime').textContent = this.formatTime(new Date());
        
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.messageInput.addEventListener('input', () => {
            this.updateCharacterCount();
            this.updateSendButton();
            this.autoResize();
        });
        
        // Check API health on load
        this.checkApiHealth();
    }

    async checkApiHealth() {
        try {
            const response = await fetch('/api/health');
            if (response.ok) {
                this.updateStatus('online');
            } else {
                this.updateStatus('offline');
            }
        } catch (error) {
            console.error('Health check failed:', error);
            this.updateStatus('offline');
        }
    }

    updateStatus(status) {
        const statusText = this.statusIndicator.querySelector('.status-text');
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        
        if (status === 'online') {
            statusText.textContent = 'Online';
            statusDot.style.background = '#2ecc71';
        } else {
            statusText.textContent = 'Offline';
            statusDot.style.background = '#e74c3c';
        }
    }

    updateCharacterCount() {
        const length = this.messageInput.value.length;
        this.characterCount.textContent = `${length}/4000`;
        
        if (length > 3800) {
            this.characterCount.style.color = '#e74c3c';
        } else if (length > 3500) {
            this.characterCount.style.color = '#f39c12';
        } else {
            this.characterCount.style.color = '#999';
        }
    }

    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isLoading;
    }

    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.updateCharacterCount();
        this.updateSendButton();
        this.autoResize();

        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            this.isLoading = true;
            this.updateSendButton();

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversation_history: this.conversationHistory
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: data.response }
            );
            
            // Keep conversation history manageable (last 10 exchanges)
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            // Add bot response to chat
            this.addMessage(data.response, 'bot');
            
        } catch (error) {
            console.error('Error:', error);
            this.addErrorMessage(error.message);
        } finally {
            this.hideTypingIndicator();
            this.isLoading = false;
            this.updateSendButton();
            this.messageInput.focus();
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // Format the message with basic markdown-style formatting
        if (sender === 'bot') {
            textDiv.innerHTML = this.formatBotMessage(text);
        } else {
            textDiv.textContent = text;
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(new Date());
        
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timeDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addErrorMessage(errorText) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <strong>Error:</strong> ${errorText}
            <br><small>Please try again or check your connection.</small>
        `;
        
        this.chatMessages.appendChild(errorDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    formatBotMessage(text) {
        // Convert basic markdown-style formatting to HTML
        return text
            // Convert **bold** to <strong>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert line breaks to <br>
            .replace(/\n/g, '<br>')
            // Convert numbered lists (1. item) with better spacing
            .replace(/^(\d+)\.\s(.+)$/gm, '<div class="list-item numbered"><strong>$1. $2</strong></div>')
            // Convert bullet points (- item)
            .replace(/^-\s(.+)$/gm, '<div class="list-item bullet">• $1</div>')
            // Remove any citation references that might slip through
            .replace(/\[doc\d+\]/g, '')
            // Add extra spacing between numbered sections
            .replace(/(<\/div>)(<div class="list-item numbered">)/g, '$1<br>$2')
            // Clean up multiple consecutive breaks
            .replace(/(<br>\s*){3,}/g, '<br><br>')
            // Add spacing after colons followed by line breaks
            .replace(/:\s*<br>/g, ':<br><br>');
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
