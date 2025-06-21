import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './signup'
import Login from './login'
import Dashboard from './dashboard'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/dash" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
