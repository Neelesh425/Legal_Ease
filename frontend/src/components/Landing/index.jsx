import { useNavigate } from 'react-router-dom'
import './index.scss'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Unlock the Power of Your Documents with
            <span className="brand-highlight"> LegalEase</span>
          </h1>
          <p className="hero-subtitle">
            AI-powered document analysis and legal assistance at your fingertips.
            Upload, analyze, and get instant insights from your documents.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Get Started Free
            </button>
            <button className="btn-secondary" onClick={() => navigate('/signin')}>
              Sign In
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <span className="card-icon">📄</span>
            <p>Document Upload</p>
          </div>
          <div className="floating-card card-2">
            <span className="card-icon">🤖</span>
            <p>AI Analysis</p>
          </div>
          <div className="floating-card card-3">
            <span className="card-icon">⚖️</span>
            <p>Legal Insights</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Powerful Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📤</span>
            </div>
            <h3>Easy Upload</h3>
            <p>Support for PDF, DOCX, and TXT files. Drag and drop or browse to upload your documents instantly.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🧠</span>
            </div>
            <h3>Smart Analysis</h3>
            <p>Powered by advanced AI models using Ollama for intelligent document understanding and analysis.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">💬</span>
            </div>
            <h3>Interactive Chat</h3>
            <p>Ask questions about your documents and get instant, accurate answers in natural language.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">⚖️</span>
            </div>
            <h3>Legal Assistance</h3>
            <p>Get general legal information and guidance without uploading any documents.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🔒</span>
            </div>
            <h3>Secure & Private</h3>
            <p>Your documents are encrypted and private. Only you can access your uploaded files.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">⚡</span>
            </div>
            <h3>Lightning Fast</h3>
            <p>Get instant responses with our optimized AI pipeline and efficient processing.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up in seconds with just your email and password</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Upload Document</h3>
            <p>Upload your PDF, DOCX, or TXT files securely</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Ask Questions</h3>
            <p>Chat with your document and get instant insights</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Document Workflow?</h2>
          <p>Join thousands of users who trust LegalEase for their document analysis needs</p>
          <button className="btn-primary-large" onClick={() => navigate('/signup')}>
            Start Analyzing Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 LegalEase. Powered by Ollama & FastAPI.</p>
      </footer>
    </div>
  )
}

export default Landing