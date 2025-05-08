import { sendDelete, sendGet, sendPatch, sendPost } from '~/api/request';

export const userApi = {
  getMe: () => {
    return sendGet('/api/users/me');
  },
  updateMe: (data?: any) => {
    return sendPatch('/api/users/me', data);
  },
  follow: (id: string) => {
    return sendPost(`/api/users/${id}/follow`);
  },
  unfollow: (ids: string[]) => {
    return sendPost(`/api/users/un-follow`, { ids });
  },
  rejectFollow: (id: string) => {
    return sendDelete(`/api/users/${id}/reject-follow`);
  },
  closeFollow: (id: string) => {
    return sendDelete(`/api/users/${id}/close-follow`);
  },
  getProfileById: (id?: string) => {
    return sendGet(`/api/users/${id}`);
  },
  getMediaById: (id?: string) => {
    return sendGet(`/api/users/${id}/media`);
  }
};
