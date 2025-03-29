export async function POST(request) {
  const body = await request.json();
  const { skill } = body;
  
  if (!skill) {
    return Response.json({ error: 'Skill is required' }, { status: 400 });
  }
  
  try {
    // Generate roadmap using OpenAI
    const roadmap = await generateRoadmapWithOpenAI(skill);
    
    return Response.json({ 
      message: 'Roadmap generated successfully',
      data: roadmap
    });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return Response.json({ 
      error: 'Failed to generate roadmap',
      message: error.message 
    }, { status: 500 });
  }
} 

async function generateRoadmapWithOpenAI(skill) {
  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  
  const prompt = `Generate a comprehensive learning roadmap for ${skill}. 
  Please provide 10 major concepts/steps a person should master, presented as a list. 
  For each concept, include a brief description of what it entails.
  Format the response as a JSON array with objects containing 'title' and 'description' fields.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates learning roadmaps for various skills.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.log( "OpenAI key: ", apiKey );
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    // Extract the JSON array from the response
    // First attempt to parse the entire content as JSON
    return JSON.parse(content);
  } catch (e) {
    // If that fails, try to extract JSON from the text response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    console.log( "had to extract json from the text response" );
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If we still can't parse the JSON, throw an error
    throw new Error('Failed to parse the roadmap from OpenAI response');
  }
} 