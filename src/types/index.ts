export interface Dream {
  id: string;
  content: string;
  mood: 'sad' | 'neutral' | 'happy' | 'excited' | 'anxious';
  isPublic: boolean;
  createdAt: Date;
  analysis?: DreamAnalysis;
  startupIdea?: StartupIdea;
}

export interface DreamAnalysis {
  symbols: Symbol[];
  emotions: Emotion[];
  keywords: string[];
  tone: string;
  themes: string[];
}

export interface Symbol {
  name: string;
  meaning: string;
  icon: string;
}

export interface Emotion {
  name: string;
  intensity: number;
  color: string;
}

export interface StartupIdea {
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  techStack: string[];
  monetization: string;
  competitiveAdvantage: string;
}

export interface BusinessModelCanvas {
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface VCChat {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  rating?: number;
}

export interface AppMockup {
  id: string;
  imageUrl: string;
  description: string;
  createdAt: Date;
} 