// services/messageService.ts
import { api } from '@/api/api';

export const getChats = async () => {
  try {
    const response = await api.get('/messages/chats');
    return response.data;
  } catch (e) {
    console.log(e as any);
  }
};
