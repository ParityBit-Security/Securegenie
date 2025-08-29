import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Anthropic Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://securegenie-gh6xyupp0-yaakulyas-projects.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Rate limiting - 10 requests per IP per hour
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many requests from this IP. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Security Policy Generator
app.post('/api/generate-policy', async (req, res) => {
  try {
    const { companyName, industry, size, specificRequirements } = req.body;

    const prompt = `Generate a comprehensive security policy for:
Company: ${companyName}
Industry: ${industry}
Size: ${size} employees
Additional Requirements: ${specificRequirements || 'None'}

Create a professional, actionable security policy covering:
1. Information Security Governance
2. Access Control
3. Data Protection
4. Incident Response
5. Employee Security Training
6. Physical Security
7. Network Security
8. Business Continuity

Format as a structured document with clear sections and actionable guidelines.`;

    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.7,
      system: "You are a cybersecurity expert specializing in creating comprehensive security policies for organizations. Generate professional, compliance-ready security policies that are detailed, actionable, and industry-specific.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const policy = completion.content[0].type === 'text' ? completion.content[0].text : 'Failed to generate policy';
    res.json({ success: true, policy });

  } catch (error) {
    console.error('Policy generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate security policy. Please try again.' 
    });
  }
});

// Compliance Gap Analyzer
app.post('/api/analyze-compliance', async (req, res) => {
  try {
    const { framework, currentSetup, industry } = req.body;

    const prompt = `Analyze compliance gaps for:
Framework: ${framework}
Current Setup: ${currentSetup}
Industry: ${industry}

Provide:
1. Current compliance status assessment
2. Identified gaps and vulnerabilities
3. Risk level for each gap (High/Medium/Low)
4. Specific remediation steps
5. Priority order for addressing gaps
6. Estimated timeline for compliance

Be specific and actionable in recommendations.`;

    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.3,
      system: "You are a compliance expert with deep knowledge of regulatory frameworks including GDPR, SOX, HIPAA, ISO 27001, PCI DSS, and industry-specific regulations. Provide detailed, actionable compliance analysis with specific remediation steps.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const analysis = completion.content[0].type === 'text' ? completion.content[0].text : 'Failed to generate analysis';
    res.json({ success: true, analysis });

  } catch (error) {
    console.error('Compliance analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze compliance gaps. Please try again.' 
    });
  }
});

// Security Questionnaire Assistant
app.post('/api/fill-questionnaire', async (req, res) => {
  try {
    const { questionnaire, companyInfo } = req.body;

    const prompt = `Fill out this security questionnaire based on the company information provided:

Company Information:
${companyInfo}

Questionnaire:
${questionnaire}

Provide:
1. Complete answers to all questions
2. Professional, compliant responses
3. Mark any questions that need manual review as "[REQUIRES REVIEW]"
4. Include supporting explanations where appropriate

Format responses clearly for each question.`;

    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.2,
      system: "You are a security consultant expert at filling out vendor security questionnaires and RFPs. Provide accurate, professional responses based on the company information provided. Be thorough and precise in your answers.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const responses = completion.content[0].type === 'text' ? completion.content[0].text : 'Failed to generate responses';
    res.json({ success: true, responses });

  } catch (error) {
    console.error('Questionnaire filling error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fill questionnaire. Please try again.' 
    });
  }
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// For Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`SecureGenie backend running on port ${PORT}`);
  });
}