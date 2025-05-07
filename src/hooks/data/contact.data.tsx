import { useQuery } from '@tanstack/react-query';
import { contactApi } from '~/services/api/contact.api';

export const useGetFriendQuery = (params: any) => {
  return useQuery({
    queryKey: ['FRIENDS'],
    queryFn: () => contactApi.getFriends(params),
    enabled: true,
  });
};
export const useGetSuggestedFriendQuery = (enable: boolean = true) => {
  return useQuery({
    queryKey: ['SUGGESTED_FRIENDS'],
    queryFn: contactApi.getSuggestedFriend,
    enabled: enable,
  });
};
export const useGetFollowerFriendQuery = (enable: boolean = true) => {
  return useQuery({
    queryKey: ['FOLLOWERS'],
    queryFn: contactApi.getFollowers,
    enabled: enable,
  });
};
