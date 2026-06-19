import { api } from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";

export interface Topic {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl?: string;
  pdfUrl?: string;
  mcqs: any[];
  interviewQuestions: any[];
}

export const topicsService = {
  async getTopicById(id: string): Promise<any> {
    const response = await api.get(API_ENDPOINTS.TOPICS.BY_ID(id));
    return response.data;
  },

  async createTopic(data: { 
    courseId: string; 
    moduleId: string; 
    title: string; 
    description: string;
    videoFile?: File | null;
    pdfFile?: File | null;
    mcqs: string; // JSON string
    interviewQuestions: string; // JSON string
  }): Promise<Topic> {
    const formData = new FormData();
    formData.append('courseId', data.courseId);
    formData.append('moduleId', data.moduleId);
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.videoFile) formData.append('video', data.videoFile);
    if (data.pdfFile) formData.append('pdf', data.pdfFile);
    formData.append('mcqs', data.mcqs);
    formData.append('interviewQuestions', data.interviewQuestions);

    const response = await api.post(API_ENDPOINTS.TOPICS.ROOT, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data.topic;
  },

  async updateTopic(id: string, data: { 
    title?: string; 
    description?: string;
    videoFile?: File | null;
    pdfFile?: File | null;
    mcqs?: string; 
    interviewQuestions?: string;
  }): Promise<Topic> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.videoFile) formData.append('video', data.videoFile);
    if (data.pdfFile) formData.append('pdf', data.pdfFile);
    if (data.mcqs) formData.append('mcqs', data.mcqs);
    if (data.interviewQuestions) formData.append('interviewQuestions', data.interviewQuestions);

    const response = await api.put(API_ENDPOINTS.TOPICS.BY_ID(id), formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data.topic;
  },

  async deleteTopic(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.TOPICS.BY_ID(id));
  }
};
