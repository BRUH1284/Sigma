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

export const getConversation = async (otherUsername: string) => {
  try {
    const response = await api.get(`/messages/conversation/${otherUsername}`);
    return response.data;
  } catch (e) {
    console.error(`Ошибка при загрузке переписки с ${otherUsername}:`, e);
    throw e;
  }
};

export const sendMessage = async (data: {
  receiverUsername: string;
  content: string;
}) => {
  try {
    const response = await api.post('/messages', data);
    return response.data;
  } catch (e) {
    console.error('Ошибка при отправке сообщения:', e);
    throw e;
  }
};
