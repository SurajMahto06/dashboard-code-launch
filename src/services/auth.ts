import { User } from "@/types";
import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import axios from "axios";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const authService = {
  async register(data: any): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new AuthError(error.response.data.message || "Registration failed");
      }
      throw new AuthError("Unable to connect to server");
    }
  },

  async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new AuthError("Email and password are required.");
    }

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      const data = response.data;

      // Save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Convert role to lower case to match dashboard's expected types if necessary
      const user = data.user;
      user.role = user.role.toLowerCase();
      user.enrolledCourseIds = user.enrolledCourses?.map((c: any) => c.id) || [];
      user.assignedCourseIds = user.assignedCourses?.map((c: any) => c.id) || [];
      user.completedTopicIds = user.completedTopics?.map((c: any) => c.id) || [];
      user.menteeIds = user.mentees?.map((m: any) => m.id) || [];

      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new AuthError(error.response.data.message || "Invalid email or password");
      }
      throw new AuthError("Unable to connect to server");
    }
  },

  async getMe(): Promise<User | null> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return null;

    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      const user = response.data.user;
      user.role = user.role.toLowerCase();
      user.enrolledCourseIds = user.enrolledCourses?.map((c: any) => c.id) || [];
      user.assignedCourseIds = user.assignedCourses?.map((c: any) => c.id) || [];
      user.completedTopicIds = user.completedTopics?.map((c: any) => c.id) || [];
      user.menteeIds = user.mentees?.map((m: any) => m.id) || [];
      
      return user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      return null;
    }
  },

  async completeTopic(topicId: string): Promise<{ message: string, progressPercentage: number }> {
    const response = await api.post(API_ENDPOINTS.AUTH.COMPLETE_TOPIC, { topicId });
    return response.data;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }
};
