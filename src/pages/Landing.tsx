import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, ArrowRight, Brain, Rocket, Users, TrendingUp, Star, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [logoAnimation, setLogoAnimation] = useState(false);

  const fullText = "Dream Startup Generator";
  const typeSpeed = 100; // Faster typing speed

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setCurrentText(fullText.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, typeSpeed);

    // Start logo animation after typing
    setTimeout(() => {
      setLogoAnimation(true);
    }, fullText.length * typeSpeed + 500);

    return () => clearInterval(typeInterval);
  }, []);

  const handleStartNow = () => {
    navigate('/dream-input');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className={`logo-icon ${logoAnimation ? 'animate-logo' : ''}`}>
              <Zap size={20} />
            </div>
            <div className="logo-text">
              <div className="logo-title">Dream Startup</div>
              <div className="logo-subtitle">AI-Powered Innovation</div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Animated Logo */}
            <div className="mb-12 hero-logo-container">
              <div className={`hero-logo ${logoAnimation ? 'animate-hero-logo' : ''}`}>
                <div className="logo-glow"></div>
                <div className="logo-core">
                  <Brain size={80} className="text-white" />
                </div>
                <div className="logo-particles">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`particle particle-${i + 1}`}>
                      <Sparkles size={16} className="text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Typewriter Title */}
            <div className="mb-8">
              <h1 className="hero-title">
                <span className="typewriter-text">{currentText}</span>
                {isTyping && <span className="cursor">|</span>}
              </h1>
              <p className="hero-subtitle">
                Transform your dreams into innovative startup ideas with AI-powered analysis
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-16">
              <button
                onClick={handleStartNow}
                className="hero-cta-btn"
                disabled={isTyping}
              >
                <Play size={24} />
                Start Your Journey
                <ArrowRight size={24} />
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              <div className="feature-card">
                <div className="feature-icon">
                  <Brain size={32} />
                </div>
                <h3 className="feature-title">AI Dream Analysis</h3>
                <p className="feature-description">
                  Advanced AI analyzes your dreams for hidden meanings and patterns
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Rocket size={32} />
                </div>
                <h3 className="feature-title">Startup Generation</h3>
                <p className="feature-description">
                  Transform dream insights into complete startup ideas and business models
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <TrendingUp size={32} />
                </div>
                <h3 className="feature-title">Market Insights</h3>
                <p className="feature-description">
                  Get detailed market analysis and competitive intelligence
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Dreams Analyzed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Startups Generated</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">AI Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="text-center">
            <p className="text-secondary">
              © 2024 Dream Startup Generator. Transform your dreams into reality.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 