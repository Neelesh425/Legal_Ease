// API utility for making authenticated requests

const API_BASE_URL = 'http://localhost:8000'

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Make authenticated API request
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  // Add authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  
  // Handle 401 Unauthorized (token expired or invalid)
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/signin'
    throw new Error('Session expired. Please sign in again.')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Request failed')
  }

  return data
}

// Specific API functions
export const uploadDocument = async (file) => {
  const token = getAuthToken()
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/signin'
    throw new Error('Session expired. Please sign in again.')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Upload failed')
  }

  return data
}

export const chatWithDocument = async (documentId, question, model = 'llama3.2') => {
  return apiRequest('/chat', {
    method: 'POST',
    body: JSON.stringify({
      document_id: documentId,
      question,
      model,
    }),
  })
}

export const legalChat = async (message) => {
  return apiRequest('/api/legal/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

export const legalChatWithHistory = async (messages) => {
  return apiRequest('/api/legal/chat-history', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  })
}

export const getDocument = async (documentId) => {
  return apiRequest(`/document/${documentId}`)
}

export const listModels = async () => {
  return apiRequest('/models')
}