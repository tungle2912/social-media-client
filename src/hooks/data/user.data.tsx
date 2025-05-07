import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { userApi } from '~/services/api/user.api';

export const useGetMeQuery = (enable: boolean = true) => {
  return useQuery({
    queryKey: ['PROFILE'],
    queryFn: userApi.getMe,
    enabled: enable,
  });
};
export const useGetMediaByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['MEDIA', id],
    queryFn: () => userApi.getMediaById(id),
    enabled: !!id,
  });
};
export const useUpdateProfileMutation = () => {
  const { update } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateMe,
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
export const useFollowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: any) => userApi.follow(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['PROFILE'],
      });
    },
  });
};
export const useUnFollowMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userApi.unfollow(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['PROFILE'],
      });
    },
  });
};
export const useRejectFollowMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.rejectFollow(id),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['PROFILE'],
      });
    },
  });
};
