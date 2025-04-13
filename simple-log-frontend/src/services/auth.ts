// This would be replaced with actual authentication logic
// Currently using mock data for demo purposes

// Simulated user data store
let currentUser: { email: string } | null = null;

interface AuthCredentials {
  email: string;
  password: string;
}

// Mock function to simulate user registration
export const registerUser = async (
  credentials: AuthCredentials
): Promise<void> => {
  // In a real app, this would make an API request to register the user
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful registration
      console.log("User registered:", credentials.email);
      resolve();
    }, 800);
  });
};

// Mock function to simulate user login
export const loginUser = async (
  credentials: AuthCredentials
): Promise<void> => {
  // In a real app, this would make an API request to authenticate the user
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful login
      currentUser = { email: credentials.email };
      localStorage.setItem("user", JSON.stringify(currentUser));
      console.log("User logged in:", currentUser);
      resolve();
    }, 800);
  });
};

// Mock function to simulate user logout
export const logoutUser = (): void => {
  currentUser = null;
  localStorage.removeItem("user");
  console.log("User logged out");
};

// Mock function to check if a user is logged in
export const getCurrentUser = (): { email: string } | null => {
  if (currentUser) return currentUser;

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }

  return null;
};

// Mock function to check if a user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
