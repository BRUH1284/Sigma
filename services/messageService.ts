// services/messageService.ts
import { api } from '@/api/api';

export const getChats = async () => {
  const response = await api.get('/messages/chats');
  return response.data;
};
