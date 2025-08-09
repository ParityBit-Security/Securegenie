export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://securegenie-api.vercel.app'
  : 'http://localhost:5001';