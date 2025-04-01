import api from './api';
import { AdminStats, User, Project, ActivityLog } from '../types/admin';

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (page: number = 1, filters?: Record<string, string>): Promise<{ users: User[], total: number }> => {
    const response = await api.get('/admin/users', { params: { page, ...filters } });
    return response.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  banUser: async (userId: string): Promise<void> => {
    await api.put(`/admin/users/${userId}/ban`);
  },

  unbanUser: async (userId: string): Promise<void> => {
    await api.put(`/admin/users/${userId}/unban`);
  },

  getModeration: async (): Promise<Project[]> => {
    const response = await api.get('/admin/moderation');
    return response.data;
  },

  approveProject: async (projectId: string): Promise<void> => {
    await api.put(`/admin/moderation/${projectId}/approve`);
  },

  rejectProject: async (projectId: string, reason: string): Promise<void> => {
    await api.put(`/admin/moderation/${projectId}/reject`, { reason });
  },

  getActivityLog: async (page: number = 1): Promise<{ logs: ActivityLog[], total: number }> => {
    const response = await api.get('/admin/activity-log', { params: { page } });
    return response.data;
  }
};