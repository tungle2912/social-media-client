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
  unfollow: (id: string) => {
    return sendPost(`/api/users/${id}/un-follow`);
  },
  rejectFollow: (id: string) => {
    return sendDelete(`/api/users/${id}/reject-follow`);
  },
  getProfileById: (id?: string) => {
    return sendGet(`/api/users/${id}`);
  },
};
