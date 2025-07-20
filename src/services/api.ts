import axios from 'axios';
import { Dream, DreamAnalysis, StartupIdea, BusinessModelCanvas, VCChat, AppMockup } from '../types';
import { mockAnalyzeDream, mockGenerateStartupIdea, mockGenerateBusinessModel, mockGenerateAppMockup } from './mockApi';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dream Analysis
export const analyzeDream = async (dream: Omit<Dream, 'id' | 'createdAt'>): Promise<DreamAnalysis> => {
  try {
    const response = await api.post('/analyze-dream', {
      content: dream.content,
      mood: dream.mood
    });
    return response.data;
  } catch (error) {
    console.error('Error calling analyze-dream API:', error);
    // Fallback to mock if API fails
    return mockAnalyzeDream(dream);
  }
};

// Startup Generation
export const generateStartupIdea = async (dreamAnalysis: DreamAnalysis): Promise<StartupIdea> => {
  try {
    const response = await api.post('/generate-startup', dreamAnalysis);
    return response.data;
  } catch (error) {
    console.error('Error calling generate-startup API:', error);
    // Fallback to mock if API fails
    return mockGenerateStartupIdea(dreamAnalysis);
  }
};

// Business Model Canvas
export const generateBusinessModel = async (startupIdea: StartupIdea): Promise<BusinessModelCanvas> => {
  const response = await api.post('/generate-business-model', startupIdea);
  return response.data;
};

// App Mockup Generation
export const generateAppMockup = async (startupIdea: StartupIdea): Promise<AppMockup> => {
  const response = await api.post('/generate-mockup', startupIdea);
  return response.data;
};

// VC Chat
export const sendVCMessage = async (message: string, startupIdea: StartupIdea): Promise<VCChat> => {
  const response = await api.post('/vc-chat', { message, startupIdea });
  return response.data;
};

// Save Dream
export const saveDream = async (dream: Dream): Promise<Dream> => {
  const response = await api.post('/dreams', dream);
  return response.data;
};

// Get Dreams
export const getDreams = async (): Promise<Dream[]> => {
  const response = await api.get('/dreams');
  return response.data;
};

// Get Public Dreams
export const getPublicDreams = async (): Promise<Dream[]> => {
  const response = await api.get('/dreams/public');
  return response.data;
};

// Regenerate Section
export const regenerateSection = async (startupIdea: StartupIdea, section: string): Promise<Partial<StartupIdea>> => {
  try {
    const response = await api.post('/regenerate-section', {
      startupIdea,
      section
    });
    return response.data;
  } catch (error) {
    console.error('Error calling regenerate-section API:', error);
    throw error;
  }
};

export default api; 