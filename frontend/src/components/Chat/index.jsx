import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [documentId, setDocumentId] = useState(null)
  const [documentName, setDocumentName] = useState(null)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get document ID from localStorage
    const docId = localStorage.getItem('currentDocumentId')
    const docName = localStorage.getItem('currentDocumentName')
    
    if (!docId) {
      // If no document uploaded, redirect to upload page
      navigate('/upload')
    } else {
      setDocumentId(docId)
      setDocumentName(docName)
    }
  }, [navigate])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !documentId) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: documentId,
          question: input,
          model: 'llama3.2'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const aiMessage = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <div>
          <h1>Chat with Your Document</h1>
          {documentName && <p className="document-badge">📄 {documentName}</p>}
        </div>
        <p>Ask questions, request summaries, or get explanations</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💬</span>
            <h3>Start a conversation</h3>
            <p>Ask me anything about your document!</p>
            <div className="example-questions">
              <p className="example-title">Try asking:</p>
              <button onClick={() => setInput('Summarize this document')}>
                "Summarize this document"
              </button>
              <button onClick={() => setInput('What are the main points?')}>
                "What are the main points?"
              </button>
              <button onClick={() => setInput('Explain the key concepts')}>
                "Explain the key concepts"
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here..."
          rows="1"
          disabled={loading}
        />
        <button onClick={handleSend} disabled={!input.trim() || loading}>
          <span>➤</span>
        </button>
      </div>
    </div>
  )
}

export default Chat