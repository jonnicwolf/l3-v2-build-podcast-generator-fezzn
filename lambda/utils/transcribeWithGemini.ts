export const transcribeWithGemini = async (signedUrl: string) => {
  const url: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents: [{
      parts: [{ text: `Use this url: ${signedUrl}, to make a text transcription.`}]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Gemini API health check failed with status: ${response.status}`);

    const data  = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) console.error('Error checking Gemini API health:', error.message)
      else console.error('Unexpected error:', error);
    throw error;
  };
};