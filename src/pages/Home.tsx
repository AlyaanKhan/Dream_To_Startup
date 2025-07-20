import React, { useState } from 'react';
import DreamInput from '../components/DreamInput';
import DreamAnalysis from '../components/DreamAnalysis';
import StartupOutput from '../components/StartupOutput';
import ThemeToggle from '../components/ThemeToggle';
import { Dream, DreamAnalysis as DreamAnalysisType, StartupIdea } from '../types';
import { analyzeDream, generateStartupIdea } from '../services/api';
import { Sparkles, Brain, Rocket, Zap, Star, ArrowRight, Users, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'analysis' | 'startup'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [dream, setDream] = useState<Omit<Dream, 'id' | 'createdAt'> | null>(null);
  const [analysis, setAnalysis] = useState<DreamAnalysisType | null>(null);
  const [startup, setStartup] = useState<StartupIdea | null>(null);

  const handleDreamSubmit = async (dreamData: Omit<Dream, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setDream(dreamData);
    
    try {
      // Analyze the dream
      const dreamAnalysis = await analyzeDream(dreamData);
      setAnalysis(dreamAnalysis);
      setCurrentStep('analysis');
      
      // Generate startup idea
      const startupIdea = await generateStartupIdea(dreamAnalysis);
      setStartup(startupIdea);
      setCurrentStep('startup');
    } catch (error) {
      console.error('Error processing dream:', error);
      alert('Error processing your dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateStartup = async () => {
    if (!analysis) return;
    
    setIsLoading(true);
    try {
      const newStartup = await generateStartupIdea(analysis);
      setStartup(newStartup);
    } catch (error) {
      console.error('Error regenerating startup:', error);
      alert('Error regenerating startup idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDream = () => {
    setCurrentStep('input');
    setDream(null);
    setAnalysis(null);
    setStartup(null);
  };

  const steps = [
    { id: 'input', label: 'Share Dream', icon: Brain, active: currentStep === 'input', completed: currentStep !== 'input' },
    { id: 'analysis', label: 'Analysis', icon: Sparkles, active: currentStep === 'analysis', completed: currentStep === 'startup' },
    { id: 'startup', label: 'Startup', icon: Rocket, active: currentStep === 'startup', completed: false },
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
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
            <h1 className="heading-1 text-primary mb-6">
              Transform Dreams Into Reality
            </h1>
            <p className="text-lg text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
              Share your dreams and watch AI transform them into innovative startup ideas with detailed analysis and business insights
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="card h-full flex flex-col">
                <div className="card-body text-center flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <h3 className="heading-4 text-primary mb-2">AI-Powered</h3>
                  <p className="text-secondary">Advanced dream analysis using cutting-edge AI</p>
                </div>
              </div>
              <div className="card h-full flex flex-col">
                <div className="card-body text-center flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users size={24} className="text-white" />
                  </div>
                  <h3 className="heading-4 text-primary mb-2">Business Focused</h3>
                  <p className="text-secondary">Generate complete startup ideas with business models</p>
                </div>
              </div>
              <div className="card h-full flex flex-col">
                <div className="card-body text-center flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <h3 className="heading-4 text-primary mb-2">Market Ready</h3>
                  <p className="text-secondary">Get market analysis and competitive insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="progress-container">
            <div className="progress-steps">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={step.id}>
                    <div className={`progress-step ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
                      <div className="progress-step-icon">
                        <Icon size={20} />
                      </div>
                      <span className="progress-step-label">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="progress-connector"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-5xl mx-auto">
            {currentStep === 'input' && (
              <div className="fade-in">
                <DreamInput onSubmit={handleDreamSubmit} isLoading={isLoading} />
              </div>
            )}

            {currentStep === 'analysis' && analysis && (
              <div className="space-y-8 fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Sparkles size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="heading-2 text-primary">Dream Analysis</h2>
                      <p className="text-secondary">Understanding your dream's deeper meaning</p>
                    </div>
                  </div>
                  <button onClick={handleNewDream} className="btn btn-ghost">
                    <Star size={16} />
                    New Dream
                  </button>
                </div>
                <DreamAnalysis analysis={analysis} />
                {startup && (
                  <div className="mt-8">
                    <StartupOutput
                      startup={startup}
                      onRegenerate={handleRegenerateStartup}
                      onGenerateBusinessModel={() => {/* TODO */}}
                      onGenerateMockup={() => {/* TODO */}}
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === 'startup' && startup && (
              <div className="space-y-8 fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Rocket size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="heading-2 text-primary">Your Startup Idea</h2>
                      <p className="text-secondary">Ready to bring your dream to life</p>
                    </div>
                  </div>
                  <button onClick={handleNewDream} className="btn btn-ghost">
                    <Star size={16} />
                    New Dream
                  </button>
                </div>
                {analysis && <DreamAnalysis analysis={analysis} />}
                <StartupOutput
                  startup={startup}
                  onRegenerate={handleRegenerateStartup}
                  onGenerateBusinessModel={() => {/* TODO */}}
                  onGenerateMockup={() => {/* TODO */}}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="heading-4 text-primary mb-4">Dream Startup</h3>
              <p className="text-secondary">
                Transform your dreams into innovative startup ideas with AI-powered analysis and business insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">Features</h4>
              <ul className="space-y-2 text-secondary">
                <li>• AI Dream Analysis</li>
                <li>• Startup Generation</li>
                <li>• Business Models</li>
                <li>• Market Insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">Get Started</h4>
              <p className="text-secondary mb-4">
                Ready to transform your dreams into reality?
              </p>
              <button 
                onClick={handleNewDream}
                className="btn btn-primary"
              >
                Start Now
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-secondary text-center">
              © 2024 Dream Startup Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="spinner"></div>
            <h3 className="heading-4 text-primary mb-2">
              {currentStep === 'input' && 'Analyzing your dream...'}
              {currentStep === 'analysis' && 'Generating startup idea...'}
              {currentStep === 'startup' && 'Regenerating idea...'}
            </h3>
            <p className="text-secondary">
              This may take a few moments
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 