export const apiHealthCheck = async (path: string, name: string, maxRetries: number=5) => {
  let attempts: number = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`${name} API health check failed with status: ${response.status}`);

      return true;
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) {
        // @ts-ignore
        console.error('Error checking Gemini API health:', error.message);
        throw error;
      };
    };
  };
};