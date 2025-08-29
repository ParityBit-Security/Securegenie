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
    const { questionnaire, companyInfo } = JSON.parse(event.body);

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
      messages: [{ role: "user", content: prompt }],
    });

    const responses = completion.content[0].type === 'text' ? completion.content[0].text : 'Failed to generate responses';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, responses }),
    };
  } catch (error) {
    console.error('Questionnaire filling error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fill questionnaire. Please try again.'
      }),
    };
  }
};