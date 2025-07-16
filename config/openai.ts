import dotenv from 'dotenv';

dotenv.config();

export const config = {
  apiKey: process.env.HUGGINGFACE_API_KEY || '',
  model: process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium',
  maxTokens: parseInt(process.env.HUGGINGFACE_MAX_TOKENS || '4000'),
  temperature: parseFloat(process.env.HUGGINGFACE_TEMPERATURE || '0.7')
};

// Validation de la configuration
if (!config.apiKey) {
  console.warn('⚠️  HUGGINGFACE_API_KEY n\'est pas définie dans les variables d\'environnement');
}

export default config; 