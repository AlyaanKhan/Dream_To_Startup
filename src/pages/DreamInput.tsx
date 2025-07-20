import React, { useState, useRef } from 'react';
import { Mic, MicOff, Brain, Moon, Heart, Frown, Meh, Smile, Zap, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dream } from '../types';
import { analyzeDream, generateStartupIdea } from '../services/api';
import { showToast } from '../utils/toast';
import ThemeToggle from '../components/ThemeToggle';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface DreamInputProps {
  onSubmit?: (dream: Omit<Dream, 'id' | 'createdAt'>) => void;
}

const moodOptions = [
  { value: 'sad' as const, icon: Frown, label: 'Sad', color: '#ef4444', bgColor: '#fef2f2' },
  { value: 'anxious' as const, icon: Meh, label: 'Anxious', color: '#f59e0b', bgColor: '#fffbeb' },
  { value: 'neutral' as const, icon: Moon, label: 'Neutral', color: '#8b5cf6', bgColor: '#f3f4f6' },
  { value: 'happy' as const, icon: Smile, label: 'Happy', color: '#10b981', bgColor: '#f0fdf4' },
  { value: 'excited' as const, icon: Heart, label: 'Excited', color: '#ec4899', bgColor: '#fdf2f8' },
];

const DreamInput: React.FC<DreamInputProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Dream['mood']>('neutral');
  const [isPublic, setIsPublic] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const loadingSteps = [
    {
      id: 1,
      title: "Converting your dream to thoughts",
      description: "Extracting the essence of your dream",
      icon: "🧠",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 2,
      title: "Doing reality magic",
      description: "Transforming abstract ideas into concrete concepts",
      icon: "✨",
      color: "from-pink-500 to-purple-500"
    },
    {
      id: 3,
      title: "Analyzing dream patterns",
      description: "Identifying hidden meanings and symbols",
      icon: "🔍",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 4,
      title: "Connecting dots",
      description: "Finding business opportunities in your dream",
      icon: "🔗",
      color: "from-cyan-500 to-teal-500"
    },
    {
      id: 5,
      title: "Generating startup concept",
      description: "Creating innovative business ideas",
      icon: "💡",
      color: "from-teal-500 to-green-500"
    },
    {
      id: 6,
      title: "Building business model",
      description: "Crafting revenue strategies and market plans",
      icon: "🏗️",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 7,
      title: "Finalizing your startup",
      description: "Preparing your complete business concept",
      icon: "🚀",
      color: "from-emerald-500 to-primary"
    }
  ];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
    setCharacterCount(text.length);
  };

  const startRecording = async () => {
    try {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Speech recognition is not supported in this browser. Please use Chrome or Edge.', 'error');
        return;
      }

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('');
        showToast('Voice recording started. Start speaking...', 'info');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the text area with the transcribed text
        const newContent = content + finalTranscript;
        setContent(newContent);
        setWordCount(newContent.trim().split(/\s+/).filter(word => word.length > 0).length);
        setCharacterCount(newContent.length);
        
        setTranscript(interimTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'no-speech') {
          showToast('No speech detected. Please try again.', 'warning');
        } else if (event.error === 'audio-capture') {
          showToast('Microphone access denied. Please check permissions.', 'error');
        } else {
          showToast('Speech recognition error. Please try again.', 'error');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setTranscript('');
        showToast('Voice recording stopped.', 'success');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      showToast('Unable to start voice recording. Please try again.', 'error');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = async () => {
    if (content.trim().length === 0) {
      showToast('Please enter your dream content', 'error');
      return;
    }

    setIsLoading(true);
    setCurrentStep(0);
    showToast('Starting dream analysis...', 'info');

    let stepInterval: NodeJS.Timeout | null = null;

    // Step-by-step progress simulation
    stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          if (stepInterval) clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000); // Increased to 3 seconds per step for more realistic timing

    try {
      const dreamData = {
        content: content.trim(),
        mood,
        isPublic,
      };

      if (onSubmit) {
        onSubmit(dreamData);
      } else {
        // Analyze the dream
        const dreamAnalysis = await analyzeDream(dreamData);
        
        // Generate startup idea
        const startupIdea = await generateStartupIdea(dreamAnalysis);
        
        // Clear the interval immediately when API calls complete
        if (stepInterval) {
          clearInterval(stepInterval);
          stepInterval = null;
        }
        
        // Set to final step before navigating
        setCurrentStep(loadingSteps.length - 1);
        
        // Small delay to show completion
        setTimeout(() => {
          // Navigate to results page with data
          navigate('/results', { 
            state: { 
              dream: dreamData, 
              analysis: dreamAnalysis, 
              startup: startupIdea 
            } 
          });
        }, 1000);
      }

      // Only show success toast if not navigating (for onSubmit case)
      if (onSubmit) {
        showToast('Dream analysis completed!', 'success');
      }
    } catch (error) {
      console.error('Error processing dream:', error);
      if (stepInterval) {
        clearInterval(stepInterval);
        stepInterval = null;
      }
      showToast('Error processing your dream. Please try again.', 'error');
    } finally {
      if (stepInterval) {
        clearInterval(stepInterval);
      }
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleMoodSelect = (selectedMood: Dream['mood']) => {
    setMood(selectedMood);
    showToast(`Mood set to: ${selectedMood}`, 'success');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-ghost"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <div className="logo">
            <div className="logo-icon">
              <Brain size={20} />
            </div>
            <div className="logo-text">
              <div className="logo-title">Share Your Dream</div>
              <div className="logo-subtitle">Step 1 of 3</div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="card fade-in">
              <div className="card-header">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Brain size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="heading-3 text-primary">Share Your Dream</h2>
                    <p className="text-secondary">Describe your dream and let AI transform it into a startup idea</p>
                  </div>
                </div>
              </div>
              
              <div className="card-body">
                <div className="space-y-8">
                  {/* Dream Content */}
                  <div className="form-group">
                    <label className="form-label">Dream Content</label>
                    <div className="relative">
                      <textarea
                        className="form-textarea"
                        placeholder="Describe your dream here... (Ctrl+Enter to submit)"
                        value={content}
                        onChange={handleContentChange}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-4 text-xs text-muted">
                        <span>{wordCount} words</span>
                        <span>{characterCount} characters</span>
                      </div>
                    </div>
                    {/* Live transcript display */}
                    {isRecording && transcript && (
                      <div className="mt-2 p-3 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg">
                        <div className="text-sm text-primary font-medium mb-1">Live transcript:</div>
                        <div className="text-sm text-secondary italic">{transcript}</div>
                      </div>
                    )}
                  </div>

                  {/* Voice Input */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`btn ${isRecording ? 'btn-secondary' : 'btn-ghost'}`}
                      disabled={isLoading}
                    >
                      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                      {isRecording ? 'Stop Recording' : 'Voice Input'}
                    </button>
                    {isRecording && (
                      <div className="flex items-center gap-2">
                        <div className="spinner"></div>
                        <span className="text-sm text-error font-medium">Recording...</span>
                      </div>
                    )}
                  </div>

                  {/* Mood Selection */}
                  <div className="form-group">
                    <label className="form-label">How did this dream make you feel?</label>
                    <div className="grid grid-cols-5 gap-4">
                      {moodOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = mood === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleMoodSelect(option.value)}
                            className={`mood-option ${isSelected ? 'mood-selected' : ''}`}
                            disabled={isLoading}
                          >
                            <div className="mood-icon">
                              <Icon size={28} className={isSelected ? 'text-white' : ''} />
                              {isSelected && (
                                <div className="mood-check">
                                  <Check size={16} className="text-white" />
                                </div>
                              )}
                            </div>
                            <span className="mood-label">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="p-6 bg-bg-secondary rounded-xl border border-border">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                          className="w-5 h-5 text-primary border-border rounded focus:ring-primary focus:ring-2"
                          disabled={isLoading}
                        />
                        <span className="font-semibold text-primary">Make this dream public</span>
                      </label>
                      <span className="text-sm text-secondary">
                        {isPublic ? 'Others can see and remix your dream' : 'Only you can see this dream'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || content.trim().length === 0}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isLoading ? (
                    <div className="step-progress-container">
                      <div className="step-progress-header">
                        <div className="step-progress-icon">
                          <Sparkles size={24} className="text-white" />
                        </div>
                        <div className="step-progress-text">
                          <h4 className="step-title">{loadingSteps[currentStep]?.title}</h4>
                          <p className="step-description">{loadingSteps[currentStep]?.description}</p>
                        </div>
                      </div>
                      <div className="step-progress-bar">
                        <div 
                          className="step-progress-fill"
                          style={{ 
                            width: `${((currentStep + 1) / loadingSteps.length) * 100}%`,
                            background: `linear-gradient(90deg, var(--primary), var(--secondary))`
                          }}
                        ></div>
                      </div>
                      <div className="step-progress-steps">
                        {loadingSteps.map((step, index) => (
                          <div 
                            key={step.id}
                            className={`step-indicator ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                          >
                            <div className="step-number">{step.id}</div>
                            <div className="step-icon">{step.icon}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Zap size={24} />
                      Transform Dream to Startup
                    </>
                  )}
                </button>
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

export default DreamInput; 