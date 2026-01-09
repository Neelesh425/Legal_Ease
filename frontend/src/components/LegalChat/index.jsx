import { useState, useRef, useEffect } from 'react'
import './index.scss'

const LegalChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '⚖️ Welcome to Legal Advice Chat. I can provide general legal information to help you understand legal concepts and procedures. Please note: This is not legal advice, and I am not your attorney. For specific legal matters, please consult with a licensed attorney in your jurisdiction.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/legal/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '⚖️ Chat cleared. How can I help you with legal information today?'
      }
    ])
  }

  return (
    <div className="legal-chat">
      <div className="chat-header">
        <h1>Legal Advice Chat</h1>
        <button onClick={clearChat} className="clear-btn" disabled={loading}>
          Clear Chat
        </button>
      </div>

      <div className="disclaimer-banner">
        <strong>⚠️ Disclaimer:</strong> This chatbot provides general legal information only. 
        It is not a substitute for legal advice from a licensed attorney. For specific legal 
        matters, please consult with a qualified lawyer in your jurisdiction.
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-icon">
              {message.role === 'user' ? '👤' : '⚖️'}
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-icon">⚖️</div>
            <div className="message-content loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
          disabled={loading}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="send-btn"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default LegalChat