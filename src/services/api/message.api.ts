import { sendDelete, sendGet, sendPost } from '~/api/request';

export const messageApi = {
  getConversationRecentMessage: (data?: any) => {
    return sendGet('/api/conversations/recent-message', data);
  },
  getConversationsDetailMessage: (_id: string | null, data?: any) => {
    return sendGet(`/api/conversations/detail-message/${_id}`, data);
  },
  deleteConservation: (id: string) => {
    return sendDelete(`/api/conversations/${id}`);
  },
  createConversationMessage: (data: any) => {
    return sendPost('/api/messages', data);
  },
  createGroupConservation: (data: any) => {
    return sendPost('/api/conversations/create-group', data);
  },
  deleteMessage: (id: string, data: any) => {
    return sendDelete(`/api/messages/${id}`, data);
  }
};
