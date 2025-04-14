
import { sendGet, sendPatch } from "~/api/request";

export const userApi = {
  getProfile: () => {
    return sendGet('/api/users/me');
  },
  updateProfile: (data?: any) => {
    return sendPatch('/api/users/me', data);
  },
};
