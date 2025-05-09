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
  getSuggestedFriend: async (data: any) => {
    return sendGet(`/api/contacts/suggested_friends`, data);
  },
  getFollowings: async (data: any) => {
    return sendGet(`/api/contacts/followings`, data);
  },
  getFollowers: async (data: any) => {
    return sendGet(`/api/contacts/followers`, data);
  },
  getRecommended: async (data: any) => {
    return sendGet(`/api/contacts/recommended`, data);
  },
  getFriendById: async (id: string, data: any) => {
    return sendGet(`/api/contacts/friends/${id}`, data);
  },
};
