import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Brain, Rocket, Sparkles, Star, Crown, CheckCircle, 
  TrendingUp, DollarSign, Target, RefreshCw, Download, Share2, 
  ExternalLink, Copy, CheckCircle as CheckCircleIcon, Eye, Zap as ZapIcon, Users as UsersIcon, 
  DollarSign as DollarIcon, Target as TargetIcon, Star as StarIcon, Crown as CrownIcon, Award, ChevronRight,
  Loader2, Layout, X, Settings, Heart, Database, Image, Type, MousePointer, 
  Menu, BarChart3 as BarChartIcon, Activity, Navigation, Square, Circle, Shield, 
  HelpCircle, Info, User, Palette, Smartphone, Globe, Sparkles as SparklesIcon, FileText
} from 'lucide-react';
import DreamAnalysis from '../components/DreamAnalysis';
import StartupOutput from '../components/StartupOutput';
import { Dream, DreamAnalysis as DreamAnalysisType, StartupIdea } from '../types';
import { showToast } from '../utils/toast';
import ThemeToggle from '../components/ThemeToggle';

interface ResultsState {
  dream: Omit<Dream, 'id' | 'createdAt'>;
  analysis: DreamAnalysisType;
  startup: StartupIdea;
}

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'analysis' | 'startup'>('analysis');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showStartup, setShowStartup] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);

  const state = location.state as ResultsState;

  useEffect(() => {
    if (!state?.dream || !state?.analysis || !state?.startup) {
      showToast('No results found. Please start over.', 'error');
      navigate('/');
      return;
    }

    // Animate in analysis first
    setTimeout(() => {
      setShowAnalysis(true);
    }, 500);

    // Show startup after a delay
    setTimeout(() => {
      setCurrentStep('startup');
      setShowStartup(true);
    }, 3000);
  }, [state, navigate]);

  const handleRegenerateStartup = async () => {
    if (!state?.analysis) return;
    
    showToast('Regenerating startup idea...', 'info');
    
    try {
      // Simulate regeneration
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast('New startup idea generated!', 'success');
    } catch (error) {
      showToast('Error regenerating startup idea.', 'error');
    }
  };

  const handleNewDream = () => {
    navigate('/dream-input');
  };

  if (!state?.dream || !state?.analysis || !state?.startup) {
    return null;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-ghost hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <div className="logo">
            <div className="logo-icon animate-pulse">
              <Sparkles size={20} />
            </div>
            <div className="logo-text">
              <div className="logo-title">Your Results</div>
              <div className="logo-subtitle">Step 3 of 3</div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Beautiful Modern Header */}
          <div className="results-hero-section mb-12">
            <div className="results-hero-content">
              <div className="results-hero-left">
                <div className="results-hero-icon">
                  <Sparkles size={32} className="text-white" />
                  <div className="results-hero-glow"></div>
                </div>
                <div className="results-hero-text">
                  <h1 className="results-hero-title">Your Dream Transformation</h1>
                  <p className="results-hero-subtitle">From dream to startup reality</p>
                </div>
              </div>
              <div className="results-hero-right">
                <div className="results-status">
                  <div className="status-indicator">
                    <div className="status-dot active"></div>
                    <span className="status-text">Analysis Complete</span>
                  </div>
                  <div className="status-indicator">
                    <div className="status-dot active"></div>
                    <span className="status-text">Startup Generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Content */}
          <div className="max-w-6xl mx-auto">
            {/* Dream Analysis Section */}
            {showAnalysis && (
              <div className={`fade-in ${currentStep === 'analysis' ? 'block' : 'hidden'}`}>
                <div className="results-header mb-8">
                  <div className="results-header-content">
                    <div className="results-header-left">
                      <div className="results-icon-container">
                        <Brain size={32} className="text-white" />
                        <div className="results-icon-glow"></div>
                      </div>
                      <div className="results-title-section">
                        <h1 className="results-title">Dream Analysis</h1>
                        <p className="results-subtitle">Understanding your dream's deeper meaning</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleNewDream} 
                      className="btn btn-primary hover:scale-105 transition-transform duration-300"
                    >
                      <Star size={20} />
                      New Dream
                    </button>
                  </div>
                </div>
                <DreamAnalysis analysis={state.analysis} />
              </div>
            )}

            {/* Startup Idea Section */}
            {showStartup && (
              <div className={`fade-in ${currentStep === 'startup' ? 'block' : 'hidden'}`}>
                <div className="results-header mb-8">
                  <div className="results-header-content">
                    <div className="results-header-left">
                      <div className="results-icon-container">
                        <Rocket size={32} className="text-white" />
                        <div className="results-icon-glow"></div>
                      </div>
                      <div className="results-title-section">
                        <h1 className="results-title">Your Startup Idea</h1>
                        <p className="results-subtitle">Ready to bring your dream to life</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleNewDream} 
                      className="btn btn-primary hover:scale-105 transition-transform duration-300"
                    >
                      <Crown size={20} />
                      New Dream
                    </button>
                  </div>
                </div>
                <StartupOutput
                  startup={state.startup}
                  onRegenerate={handleRegenerateStartup}
                  onGenerateBusinessModel={() => {
                    showToast('Business model generation coming soon!', 'info');
                  }}
                  onGenerateMockup={() => {
                    showToast('App mockup generation coming soon!', 'info');
                  }}
                />
              </div>
            )}
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

      {/* Loading Overlay */}
      {/* isLoading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="spinner"></div>
            <h3 className="heading-4 text-primary mb-2">
              Regenerating Startup Idea...
            </h3>
            <p className="text-secondary">
              Creating a new innovative concept
            </p>
          </div>
        </div>
      ) */}
    </div>
  );
};

export default Results; 