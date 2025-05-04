import { sendGet } from '~/api/request';

export const contactApi = {
  getContactProfile: async (data: any) => {
    return sendGet(`/api/contacts/`, data);
  },
  getForwardPost: async (data: any) => {
    return sendGet(`/api/contacts/forward-post`, data);
  },
  getFriends: async (data: any) => {
    return sendGet(`/api/contacts/friends`, data);
  },
  getSuggestedFriend : async (data: any) => {
    return sendGet(`/api/contacts/suggested_friends`, data);
  }
};
