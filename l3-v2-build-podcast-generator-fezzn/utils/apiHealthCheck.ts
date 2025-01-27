export const apiHealthCheck = async (path: string, name: string) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`${name} API health check failed with status: ${response.status}`);
    } return true;
  } catch (error) {
    // @ts-ignore
    console.error('Error checking Gemini API health:', error.message);
  }
};