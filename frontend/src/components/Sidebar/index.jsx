import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import './index.scss'

const Sidebar = () => {
  const [uploadedDoc, setUploadedDoc] = useState(null)

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>LegalEase</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span>🏠</span> Home
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span>📤</span> Upload
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span>💬</span> Chat
        </NavLink>
        <NavLink to="/legal-advice" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span>⚖️</span> Legal Advice
        </NavLink>
      </nav>

      {uploadedDoc && (
        <div className="document-info">
          <h3>Current Document</h3>
          <p className="doc-name">{uploadedDoc}</p>
        </div>
      )}
    </div>
  )
}

export default Sidebar