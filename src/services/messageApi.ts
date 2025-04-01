import api from './api';
import { Conversation, Message } from '../types/message';

export const messageApi = {
  getInbox: async (): Promise<Message[]> => {
    const response = await api.get('/messages/inbox');
    return response.data;
  },

  getConversation: async (username: string): Promise<Message[]> => {
    const response = await api.get(`/messages/conversation/${username}`);
    return response.data;
  },

  sendMessage: async (to: string, content: string): Promise<Message> => {
    const response = await api.post('/messages/send', null, {
      params: { to, content }
    });
    return response.data;
  }
};