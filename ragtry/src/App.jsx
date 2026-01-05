import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Upload from './components/Upload'
import Chat from './components/Chat'
import './App.scss'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="upload" element={<Upload />} />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  )
}

export default App