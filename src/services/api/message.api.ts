import { sendGet, sendPatch } from '~/api/request';

export const messageApi = {
  getConversationRecentMessage: (data?: any) => {
    return sendGet('/api/conversations/recent-message', data);
  },
  updateProfile: (data?: any) => {
    return sendPatch('/api/users/me', data);
  },
};
