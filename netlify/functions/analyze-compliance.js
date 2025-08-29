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
    const { framework, currentSetup, industry } = JSON.parse(event.body);

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
      messages: [{ role: "user", content: prompt }],
    });

    const analysis = completion.content[0].type === 'text' ? completion.content[0].text : 'Failed to generate analysis';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, analysis }),
    };
  } catch (error) {
    console.error('Compliance analysis error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to analyze compliance gaps. Please try again.'
      }),
    };
  }
};