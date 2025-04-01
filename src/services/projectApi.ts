import api from './api';
import { CreateProjectDTO, Project, Task, JobPost, Step, Candidature } from '../types/project';

export const projectApi = {
  createProject: async (data: CreateProjectDTO): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getMyProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects/mine');
    return response.data;
  },

  getNearbyProjects: async (address: string, radiusKm: number): Promise<Project[]> => {
    const response = await api.get(`/travailleurs/projects/nearby?address=${encodeURIComponent(address)}&radiusKm=${radiusKm}`);
    return response.data;
  },
  searchProjectsByKeyword: async (keyword: string): Promise<Project[]> => {
    const response = await api.get(`/travailleurs/projects/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },
  getMyTasks: async (): Promise<Task[]> => {
    const response = await api.get('/travailleurs/tasks');
    return response.data;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchProjects: async (queryString: string): Promise<Project[]> => {
    const response = await api.get(`/travailleurs/projects`);
    return response.data;
  },

  searchJobPosts: async (queryString: string): Promise<JobPost[]> => {
    const response = await api.get(`/travailleurs/postes/search?keyword=${queryString}`);
    return response.data;
  },

  searchMyApplications: async (): Promise<Candidature[]> => {
    const response = await api.get(`/candidatures/mine`);
    return response.data;
  },

  applyToJob: async (postId: string): Promise<void> => {
    await api.post(`/candidatures/apply/${postId}`);
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  getTravailleurProject: async (id: string): Promise<Project[]> => {
    const response = await api.get(`/travailleurs/projects/${id}`);
    return response.data;
  },

  getTravailleurProjects: async (): Promise<Project[]> => {
    const response = await api.get(`/travailleurs/projects`);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  uploadProjectImage: async (projectId: string, file: File): Promise<Project> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.put(`/projects/${projectId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createTask: async (projectId: string, task: Partial<Task>): Promise<Task> => {
    const response = await api.post(`/projects/${projectId}/tasks`, task);
    return response.data;
  },

  updateTask: async (taskId: string, task: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/projects/tasks/${taskId}`, task);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/projects/tasks/${taskId}`);
  },

  addTaskStep: async (taskId: string, step: Partial<Step>): Promise<Task> => {
    const response = await api.post(`/projects/tasks/${taskId}/steps`, step);
    return response.data;
  },

  updateTaskStep: async (stepIndex: number, step: Partial<Step>): Promise<Task> => {
    const response = await api.put(`/tasks/steps/${stepIndex}`, step);
    return response.data;
  },

  removeTaskStep: async (stepIndex: number): Promise<Task> => {
    const response = await api.delete(`/projects/tasks/steps/${stepIndex}`);
    return response.data;
  },

  createJobPost: async (projectId: string, post: Partial<JobPost>): Promise<JobPost> => {
    const response = await api.post(`/projects/${projectId}/postes`, post);
    return response.data;
  },

  updateJobPost: async (projectId: string, postId: string, post: Partial<JobPost>): Promise<JobPost> => {
    const response = await api.put(`/projects/${projectId}/postes/${postId}`, post);
    return response.data;
  },

  deleteJobPost: async (postId: string): Promise<void> => {
    await api.delete(`/projects/postes/${postId}`);
  },

  acceptApplication: async (applicationId: string): Promise<void> => {
    await api.put(`/candidatures/${applicationId}/accept`);
  },

  rejectApplication: async (applicationId: string): Promise<void> => {
    await api.put(`/candidatures/${applicationId}/reject`);
  },

  assignWorkersToTask: async (projectId: string, taskId: string, workerIds: string[]): Promise<void> => {
    await api.put(`/projects/${projectId}/tasks/${taskId}/assign`, workerIds);
  },

  updateStepStatus: async (stepId: string, status: string): Promise<void> => {
    await api.put(`/travailleurs/etapes/${stepId}/status?statut=${status}`);
  }
  
};