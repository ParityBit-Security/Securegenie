export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://securegenie-api.vercel.app'  // Your backend Vercel URL
  : 'http://localhost:5001';