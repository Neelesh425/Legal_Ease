import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const Upload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      // Store document ID in localStorage for access in Chat component
      localStorage.setItem('currentDocumentId', data.document_id)
      localStorage.setItem('currentDocumentName', data.filename)
      
      navigate('/chat')
    } catch (err) {
      setError('Failed to upload document. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload">
      <h1>Upload Your Document</h1>
      <p className="description">
        Upload a PDF, TXT, or DOCX file to start asking questions
      </p>

      <div 
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-content">
          <span className="upload-icon">📁</span>
          <h3>Drag and drop your file here</h3>
          <p>or</p>
          <label className="file-label">
            <input 
              type="file" 
              accept=".pdf,.txt,.docx"
              onChange={handleFileChange}
            />
            Browse Files
          </label>
          <p className="file-types">Supported: PDF, TXT, DOCX</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {file && (
        <div className="file-preview">
          <div className="file-info">
            <span className="file-icon">📄</span>
            <div className="file-details">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button className="remove-btn" onClick={() => setFile(null)}>
              ✕
            </button>
          </div>
          
          <button 
            className="upload-btn" 
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload and Continue'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Upload