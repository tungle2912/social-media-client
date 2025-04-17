import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '~/services/api/user.api';

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ['PROFILE'],
    queryFn: userApi.getProfile,
    enabled: true,
  });
};
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['PROFILE'],
      });
    },
  });
};
