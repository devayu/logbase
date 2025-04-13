
// In a real app, this would interact with a backend API
// Currently using mock data for demo purposes

// Mock API key
let currentApiKey = "sk_test_" + Math.random().toString(36).substring(2, 15);

// Mock function to get the current API key
export const getApiKey = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(currentApiKey);
    }, 300);
  });
};

// Mock function to regenerate the API key
export const regenerateApiKey = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a new random API key
      currentApiKey = "sk_test_" + Math.random().toString(36).substring(2, 15);
      console.log("API key regenerated:", currentApiKey);
      resolve(currentApiKey);
    }, 800);
  });
};
