import React from 'react';
import { DreamAnalysis as DreamAnalysisType } from '../types';
import { Zap, Heart, Brain, Target, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';

interface DreamAnalysisProps {
  analysis: DreamAnalysisType;
}

const DreamAnalysis: React.FC<DreamAnalysisProps> = ({ analysis }) => {
  const getEmotionColor = (intensity: number) => {
    if (intensity > 0.7) return '#ef4444';
    if (intensity > 0.4) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="space-y-8">
      {/* Symbols Section */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h3 className="heading-3 text-primary">Dream Symbols</h3>
              <p className="text-secondary">Key symbols and their meanings in your dream</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis.symbols.map((symbol, index) => (
              <div
                key={index}
                className="p-6 border border-border rounded-xl hover:border-border-hover transition-all duration-300 bg-bg-card hover:bg-bg-secondary group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{symbol.icon}</span>
                  <h4 className="font-semibold text-primary text-lg">{symbol.name}</h4>
                </div>
                <p className="text-secondary leading-relaxed">{symbol.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emotions Section */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h3 className="heading-3 text-primary">Emotional Analysis</h3>
              <p className="text-secondary">Understanding the emotional landscape of your dream</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="space-y-6">
            {analysis.emotions.map((emotion, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: emotion.color }}
                ></div>
                <span className="font-semibold min-w-[120px] text-primary">{emotion.name}</span>
                <div className="flex-1 bg-bg-tertiary rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${emotion.intensity * 100}%`,
                      backgroundColor: emotion.color,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-secondary w-16 text-right">
                  {Math.round(emotion.intensity * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords Section */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h3 className="heading-3 text-primary">Key Themes</h3>
              <p className="text-secondary">Main themes and concepts from your dream</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="flex flex-wrap gap-3">
            {analysis.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white text-sm rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Tone */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h3 className="heading-3 text-primary">Overall Tone</h3>
              <p className="text-secondary">The general mood and atmosphere of your dream</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <p className="text-secondary leading-relaxed text-lg">{analysis.tone}</p>
        </div>
      </div>

      {/* Themes Summary */}
      {analysis.themes.length > 0 && (
        <div className="card fade-in">
          <div className="card-header">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <h3 className="heading-3 text-primary">Recurring Themes</h3>
                <p className="text-secondary">Patterns and recurring elements in your dream</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {analysis.themes.map((theme, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-bg-secondary rounded-xl border border-border">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                  <span className="text-secondary font-medium">{theme}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamAnalysis; 