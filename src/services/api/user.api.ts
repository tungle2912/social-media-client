
import { sendGet, sendPatch, sendPost } from "~/api/request";

export const userApi = {
  getProfile: () => {
    return sendGet('/api/users/me');
  },
  updateProfile: (data?: any) => {
    return sendPatch('/api/users/me', data);
  },
  follow: (id: string) => {
    return sendPost(`/api/users/${id}/follow`);
  },
  unfollow: (id: string) => {
    return sendPost(`/api/users/${id}/un-follow`);
  }
};
