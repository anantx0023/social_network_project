import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import CreatePostPage from './pages/CreatePostPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Signup Page */}
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Home Page (Protected - requires authentication) */}
          <Route path="/home" element={<HomePage />} />
          
          {/* Create Post Page (Protected - requires authentication) */}
          <Route path="/create-post" element={<CreatePostPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
