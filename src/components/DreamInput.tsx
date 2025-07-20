import React, { useState, useRef } from 'react';
import { Mic, MicOff, Send, Moon, Heart, Frown, Meh, Smile, Sparkles, Zap, Brain } from 'lucide-react';
import { Dream } from '../types';

interface DreamInputProps {
  onSubmit: (dream: Omit<Dream, 'id' | 'createdAt'>) => void;
  isLoading?: boolean;
}

const moodOptions = [
  { value: 'sad' as const, icon: Frown, label: 'Sad', color: '#ef4444' },
  { value: 'anxious' as const, icon: Meh, label: 'Anxious', color: '#f59e0b' },
  { value: 'neutral' as const, icon: Moon, label: 'Neutral', color: '#6b7280' },
  { value: 'happy' as const, icon: Smile, label: 'Happy', color: '#10b981' },
  { value: 'excited' as const, icon: Heart, label: 'Excited', color: '#ec4899' },
];

const DreamInput: React.FC<DreamInputProps> = ({ onSubmit, isLoading = false }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Dream['mood']>('neutral');
  const [isPublic, setIsPublic] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
    setCharacterCount(text.length);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        // Here you would send the audio to your backend for Whisper API processing
        // For now, we'll just show a placeholder
        console.log('Audio recorded:', audioBlob);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = () => {
    if (content.trim().length === 0) {
      alert('Please enter your dream content');
      return;
    }

    onSubmit({
      content: content.trim(),
      mood,
      isPublic,
    });

    // Reset form
    setContent('');
    setMood('neutral');
    setIsPublic(false);
    setWordCount(0);
    setCharacterCount(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="card fade-in max-w-4xl mx-auto">
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
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(option.value)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                      mood === option.value
                        ? 'border-primary bg-primary/10 shadow-lg'
                        : 'border-border hover:border-border-hover bg-bg-card hover:bg-bg-secondary'
                    }`}
                    disabled={isLoading}
                  >
                    <Icon size={28} color={option.color} />
                    <span className="text-sm font-medium text-primary">{option.label}</span>
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
            <>
              <div className="spinner"></div>
              Analyzing Dream...
            </>
          ) : (
            <>
              <Zap size={24} />
              Transform Dream to Startup
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DreamInput; 