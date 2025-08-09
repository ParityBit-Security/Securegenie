# SecureGenie

AI-powered cybersecurity tools for GRC professionals.

## Overview

SecureGenie automates the creation of security policies, compliance analysis, and questionnaire responses, saving security teams time on manual GRC processes.

## Features

- Security Policy Generator
- Compliance Gap Analyzer  
- Security Questionnaire Assistant

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- AI: OpenAI GPT-4o Mini

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your OpenAI API key to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend requires:
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 5001)
- `FRONTEND_URL`: Frontend URL for CORS

## License

MIT