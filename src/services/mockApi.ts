import { Dream, DreamAnalysis, StartupIdea } from '../types';

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock dream analysis
export const mockAnalyzeDream = async (dream: Omit<Dream, 'id' | 'createdAt'>): Promise<DreamAnalysis> => {
  await delay(2000); // Simulate API delay
  
  const symbols = [
    { name: 'Flying', meaning: 'Freedom and liberation from constraints', icon: '🦅' },
    { name: 'Water', meaning: 'Emotional depth and subconscious thoughts', icon: '🌊' },
    { name: 'Light', meaning: 'Clarity and new understanding', icon: '💡' },
    { name: 'Bridge', meaning: 'Transition and connection between phases', icon: '🌉' },
  ];

  const emotions = [
    { name: 'Excitement', intensity: 0.8, color: '#e53e3e' },
    { name: 'Curiosity', intensity: 0.6, color: '#d69e2e' },
    { name: 'Hope', intensity: 0.7, color: '#38a169' },
    { name: 'Wonder', intensity: 0.5, color: '#3182ce' },
  ];

  const keywords = ['innovation', 'technology', 'connection', 'growth', 'future', 'community'];
  const themes = ['Digital Transformation', 'Human Connection', 'Sustainable Growth'];

  return {
    symbols,
    emotions,
    keywords,
    tone: 'Optimistic and forward-looking, with a strong focus on innovation and human connection.',
    themes,
  };
};

// Mock startup generation
export const mockGenerateStartupIdea = async (analysis: DreamAnalysis): Promise<StartupIdea> => {
  await delay(3000); // Simulate API delay

  const startupNames = [
    'DreamBridge',
    'InnovateFlow',
    'ConnectSphere',
    'FuturePulse',
    'GrowthWave',
    'TechDream',
    'VisionLink',
    'DreamCanvas',
  ];

  const randomName = startupNames[Math.floor(Math.random() * startupNames.length)];

  return {
    name: randomName,
    tagline: 'Connecting dreams to reality through innovative technology',
    description: 'A revolutionary platform that transforms abstract dreams into concrete business opportunities, leveraging AI to bridge the gap between imagination and entrepreneurship.',
    problem: 'Many people have innovative ideas from their dreams but lack the tools and guidance to transform them into viable business concepts.',
    solution: 'An AI-powered platform that analyzes dream content, extracts meaningful patterns, and generates comprehensive startup ideas with business models, market analysis, and implementation strategies.',
    targetMarket: 'Entrepreneurs, creative professionals, and individuals seeking to turn their imaginative ideas into business opportunities.',
    businessModel: 'Freemium SaaS model with premium features for advanced analysis and business model generation.',
    techStack: ['React', 'Node.js', 'OpenAI API', 'MongoDB', 'AWS'],
    monetization: 'Subscription tiers: Free (basic analysis), Pro ($29/month), Enterprise ($99/month)',
    competitiveAdvantage: 'Unique dream-to-business algorithm, comprehensive analysis, and community-driven idea validation.',
  };
};

// Mock business model generation
export const mockGenerateBusinessModel = async (startup: StartupIdea): Promise<any> => {
  await delay(2000);
  return {
    keyPartners: ['AI Technology Providers', 'Business Consultants', 'Marketing Agencies'],
    keyActivities: ['Dream Analysis', 'Business Model Generation', 'Market Research'],
    keyResources: ['AI Algorithms', 'Expert Team', 'User Data'],
    valuePropositions: ['Transform Dreams to Reality', 'AI-Powered Analysis', 'Comprehensive Business Plans'],
    customerRelationships: ['Personalized Support', 'Community Engagement', 'Continuous Learning'],
    channels: ['Web Platform', 'Mobile App', 'Social Media'],
    customerSegments: ['Entrepreneurs', 'Creative Professionals', 'Business Students'],
    costStructure: ['AI Infrastructure', 'Team Salaries', 'Marketing'],
    revenueStreams: ['Subscription Fees', 'Premium Features', 'Consulting Services'],
  };
};

// Mock app mockup generation
export const mockGenerateAppMockup = async (startup: StartupIdea): Promise<any> => {
  await delay(2500);
  return {
    id: 'mockup-1',
    imageUrl: 'https://via.placeholder.com/400x800/667eea/ffffff?text=App+Mockup',
    description: 'Modern mobile app interface for dream input and analysis',
    createdAt: new Date(),
  };
}; 