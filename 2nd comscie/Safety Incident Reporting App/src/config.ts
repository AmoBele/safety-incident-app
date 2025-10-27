// API Configuration
// This will use the environment variable in production, or localhost in development

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const config = {
  apiUrl: API_BASE_URL,
  // Add other config as needed
};
