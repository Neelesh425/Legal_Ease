import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './index.scss'

const Sidebar = () => {
  const navigate = useNavigate()
  const [uploadedDoc, setUploadedDoc] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>LegalEase</h2>
        {user && (
          <p className="user-greeting">Hello, {user.full_name?.split(' ')[0] || 'User'}!</p>
        )}
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
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

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar