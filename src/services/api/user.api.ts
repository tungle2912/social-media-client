
import { sendGet, sendPut } from "~/api/request";

export const userApi = {
  getProfile: () => {
    return sendGet('/api/users/profile');
  },
  updateProfile: (data?: any) => {
    console.log(data);
    return sendPut('/api/users/profile', data);
  },
};
