import { sendGet } from '~/api/request';

export const contactApi = {
  getContactProfile: async (data: any) => {
    return sendGet(`/api/contacts/`, data);
  },
  getForwardPost: async (data: any) => {
    return sendGet(`/api/contacts/forward-post`, data);
  }
};
