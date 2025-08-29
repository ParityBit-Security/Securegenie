const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const { companyName, industry, size, specificRequirements } = JSON.parse(event.body);

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
      messages: [{ role: "user", content: prompt }],
    });

    const policy = completion.content[0].type === 'text' ? completion.content[0].text : 'Failed to generate policy';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, policy }),
    };
  } catch (error) {
    console.error('Policy generation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to generate security policy. Please try again.'
      }),
    };
  }
};