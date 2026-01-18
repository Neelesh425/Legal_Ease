import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Landing from './components/Landing'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Home from './components/Home'
import Upload from './components/Upload'
import Chat from './components/Chat'
import LegalChat from './components/LegalChat'
import './App.scss'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/signin" replace />
  }
  
  return children
}

// Auth Route Component (redirect to home if already logged in)
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  
  if (token) {
    return <Navigate to="/home" replace />
  }
  
  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <AuthRoute>
          <Landing />
        </AuthRoute>
      } />
      
      <Route path="/signin" element={
        <AuthRoute>
          <SignIn />
        </AuthRoute>
      } />
      
      <Route path="/signup" element={
        <AuthRoute>
          <SignUp />
        </AuthRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="home" element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="chat" element={<Chat />} />
        <Route path="legal-advice" element={<LegalChat />} />
      </Route>

      {/* Catch all - redirect to landing or home based on auth */}
      <Route path="*" element={
        <Navigate to={isAuthenticated ? "/home" : "/"} replace />
      } />
    </Routes>
  )
}

export default App