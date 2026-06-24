import { NextRequest, NextResponse } from 'next/server';
import { getCropCategory } from '@/lib/cropCategories';
import { logger } from '@/server/logger';

// Function to clean up AI-generated descriptions
function cleanDescription(text: string): string {
  if (!text) return '';
  
  let cleaned = text
    // Remove citation numbers like [1], [2], [1][2], etc.
    .replace(/\[\d+\](\[\d+\])*/g, '')
    // Remove markdown bold formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove markdown headers
    .replace(/^#+\s*/gm, '')
    // Remove bullet points and dashes
    .replace(/^\s*[-•]\s*/gm, '')
    .replace(/\s+[-•]\s+/g, '. ')
    // Convert line breaks to spaces
    .replace(/\n+/g, ' ')
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Remove leading/trailing whitespace
    .trim();
  
  // Limit to reasonable length (around 60 words for 3-4 lines)
  const words = cleaned.split(' ');
  if (words.length > 60) {
    cleaned = words.slice(0, 60).join(' ') + '...';
  }
  
  // Ensure it ends with proper punctuation
  if (cleaned && !cleaned.match(/[.!?]$/)) {
    cleaned += '.';
  }
  
  return cleaned;
}

// Fallback descriptions for common plants
const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  'tomato': 'A red fruit that grows on vines. Needs warm weather and lots of water. Great for cooking and salads. Easy to grow in gardens.',
  'potato': 'A root vegetable that grows underground. Likes cool weather and moist soil. Can be boiled, fried, or baked. Very nutritious.',
  'rice': 'A grain that feeds billions of people. Grows in wet fields called paddies. Needs warm weather and lots of water. Main food in many countries.',
  'wheat': 'A grain used to make bread and pasta. Grows in fields with golden stalks. Needs good soil and some rain. Very important food crop.',
  'maize': 'Also called corn. Grows tall with big yellow ears. Needs warm weather and water. Used for food and animal feed.',
  'rose': 'A beautiful flowering bush with thorns. Has fragrant colorful flowers. Needs sunny spots and good soil. Popular in gardens worldwide.',
  'default': 'A plant with its own special needs and uses. Check what kind of soil, water, and sunlight it likes best.'
};

export async function POST(request: NextRequest) {
  try {
    const { plantName } = await request.json();

    if (!plantName || typeof plantName !== 'string') {
      return NextResponse.json(
        { error: 'Plant name is required' },
        { status: 400 }
      );
    }

    // Get category from our predefined categories
    const category = getCropCategory(plantName);

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    let description = '';

    // Try Perplexity AI if API key is available
    if (perplexityApiKey && perplexityApiKey !== 'your_perplexity_api_key_here') {
      try {
        const prompt = `Write a simple 3-4 line description of "${plantName}" in easy English. Include what it looks like, where it grows best, and its main uses. No technical terms, citations, or formatting. Keep it very short and simple for beginners.`;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful gardening assistant. Write very short, simple plant descriptions in easy English. No technical jargon, citations, or formatting. Maximum 3-4 sentences.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawDescription = data.choices?.[0]?.message?.content || '';
          
          // Clean up the description
          description = cleanDescription(rawDescription);
          logger.debug('Successfully generated AI description', { plantName });
        } else {
          const errorText = await response.text();
          logger.warn('Perplexity API error; falling back to predefined description', {
            error: errorText,
          });
        }
      } catch (apiError) {
        logger.error('Error calling Perplexity API', apiError);
      }
    }

    // Fallback to predefined descriptions if AI fails or API key not available
    if (!description) {
      const plantNameLower = plantName.toLowerCase();
      description = FALLBACK_DESCRIPTIONS[plantNameLower] || FALLBACK_DESCRIPTIONS['default'];
    }

    return NextResponse.json({
      category: category || 'Other',
      description: description.trim(),
      source: perplexityApiKey && perplexityApiKey !== 'your_perplexity_api_key_here' ? 'ai' : 'fallback'
    });

  } catch (error) {
    logger.error('Error generating plant info', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
