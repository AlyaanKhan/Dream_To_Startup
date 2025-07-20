import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import DreamInput from './pages/DreamInput';
import Results from './pages/Results';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dream-input" element={<DreamInput />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
