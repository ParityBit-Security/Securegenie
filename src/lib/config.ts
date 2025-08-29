export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Netlify Functions use relative URLs
  : 'http://localhost:5001';