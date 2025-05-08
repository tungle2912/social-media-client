import { sendGet, sendPut } from '~/api/request';

export const notificationApi = {
  getNotifications: (params?: any) => {
    return sendGet('/api/notifications', params);
  },
  getNotificationCount: () => {
    return sendGet(`/api/notifications/count`);
  },
  readNotification: (_id: string) => {
    return sendPut(`/api/notifications/read/${_id}`);
  },
  markAllAsRead: (ids: string[]) => {
    return sendPut(`/api/notifications/read/all`, { ids });
  },
};
