import { mockUsersDB, User } from "@/data/mock-dashboard";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const authService = {
  /**
   * Simulates an API call to login a user with email and password.
   * In a real app, this would be a fetch/axios call to your backend.
   */
  async login(email: string, password: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Basic validation
    if (!email || !password) {
      throw new AuthError("Email and password are required.");
    }

    if (password.length < 6) {
      throw new AuthError("Password must be at least 6 characters long.");
    }

    // Since this is a mock, we accept any 6+ character password for the demo emails
    const user = mockUsersDB.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new AuthError("Invalid email or password. Please try again.");
    }

    // Return a clone of the user object (simulating a fresh API response)
    return JSON.parse(JSON.stringify(user));
  }
};
