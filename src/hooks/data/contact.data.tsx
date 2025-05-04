import { useQuery } from '@tanstack/react-query';
import { contactApi } from '~/services/api/contact.api';

export const useGetFriendQuery = (enable: boolean = true) => {
  return useQuery({
    queryKey: ['FRIENDS'],
    queryFn: contactApi.getFriends,
    enabled: enable,
  });
};
export const useGetSuggestedFriendQuery = (enable: boolean = true) => {
  return useQuery({
    queryKey: ['SUGGESTED_FRIENDS'],
    queryFn: contactApi.getSuggestedFriend,
    enabled: enable,
  });
};
