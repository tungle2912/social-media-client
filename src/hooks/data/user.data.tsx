import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { userApi } from '~/services/api/user.api';

export const useGetProfileQuery = (enable: boolean = true) => {
  return useQuery({
    queryKey: ['PROFILE'],
    queryFn: userApi.getProfile,
    enabled: enable,
  });
};
export const useUpdateProfileMutation = () => {
  const { update } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: async (data) => {
      const newProfile = data?.result;
      await update({
        user: newProfile,
      });

      queryClient.invalidateQueries({
        queryKey: ['PROFILE'],
      });
    },
  });
};
export const useFollowMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userApi.follow(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['PROFILE'],
      });
    },
    
  });
};
