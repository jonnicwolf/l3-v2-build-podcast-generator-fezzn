export const apiHealthCheck = async () => {
  let attempts: number = 0;
  const maxRetries: number = 5;

  const url: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const body = {
    contents: [{
      parts: [{ text: 'Test.'}]
    }]
  };

  while (attempts < maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Gemini API health check failed with status: ${response.status}`);

      return true;
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) {
        // @ts-expect-error: error check
        console.error('Error checking Gemini API health:', error.message);
        throw error;
      };
    };
  };
};