# Gemini Setup

Flora uses Gemini to generate short beginner-friendly plant descriptions in `/api/generate-plant-info`.

## Environment variable

Add this to your local `.env` and deployment environment:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Where to get the key

Create an API key from Google AI Studio:

- https://aistudio.google.com/apikey

## Notes

- The app currently tries `gemini-2.5-flash` first, then `gemini-2.0-flash` as a fallback.
- If the key is missing or Gemini returns an error, Flora falls back to predefined plant descriptions.
- Restart your local dev server after changing environment variables.
