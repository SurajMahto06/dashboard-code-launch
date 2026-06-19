import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import { Assignment } from "@/types";

export const assignmentsService = {
  async getAssignments(): Promise<Assignment[]> {
    const response = await api.get(API_ENDPOINTS.ASSIGNMENTS.ROOT);
    return response.data;
  },

  async getAssignmentById(id: string): Promise<Assignment> {
    const response = await api.get(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id));
    return response.data;
  },

  async createAssignment(data: Partial<Assignment>): Promise<{ message: string, assignment: Assignment }> {
    const response = await api.post(API_ENDPOINTS.ASSIGNMENTS.ROOT, data);
    return response.data;
  },

  async updateAssignment(id: string, data: Partial<Assignment>): Promise<{ message: string, assignment: Assignment }> {
    const response = await api.put(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id), data);
    return response.data;
  },

  async submitAssignment(id: string, data: { repoUrl?: string; fileName?: string }): Promise<{ message: string, assignment: Assignment }> {
    const response = await api.put(`${API_ENDPOINTS.ASSIGNMENTS.BY_ID(id)}/submit`, data);
    return response.data;
  },

  async deleteAssignment(id: string): Promise<{ message: string }> {
    const response = await api.delete(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id));
    return response.data;
  }
};
