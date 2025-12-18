# Perplexity AI Setup Instructions

## Getting Your API Key

1. Go to [Perplexity AI API](https://www.perplexity.ai/settings/api)
2. Sign up or log in to your account
3. Navigate to API settings
4. Generate a new API key
5. Copy the API key (it should start with `pplx-`)

**Note**: Make sure you have credits in your Perplexity account to use the API.

## Setting Up the Environment Variable

1. Open your `.env` file in the project root
2. Replace `your_perplexity_api_key_here` with your actual API key:

```env
PERPLEXITY_API_KEY=pplx-your-actual-api-key-here
```

3. Save the file
4. Restart your development server

## How It Works

- **With API Key**: The system uses Perplexity AI to generate detailed, accurate plant descriptions
- **Without API Key**: The system falls back to predefined descriptions for common plants

## Testing

After setting up the API key:

1. Go to the dashboard
2. Click "Track a New Plant" 
3. Enter a plant name (e.g., "Rose", "Basil", "Oak Tree")
4. Click the "Generate" button
5. The system should populate the category and description automatically

## Supported Models

The system uses `sonar-small-online` which provides:
- Real-time web search capabilities
- Accurate botanical information
- Concise, practical descriptions suitable for plant tracking

Available Perplexity models:
- `sonar-small-online` (recommended for cost efficiency)
- `sonar-medium-online` (balanced performance)
- `sonar-large-online` (higher quality but more expensive)

## Fallback Plants

If the API is not available, the system has predefined descriptions for:
- Tomato
- Potato  
- Rice
- Wheat
- Maize (Corn)
- And a generic template for other plants