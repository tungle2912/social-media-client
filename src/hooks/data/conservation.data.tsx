import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '~/services/api/message.api';

export const useDeleteConservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messageApi.deleteConservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['LIST_CONSERVATION'] });
    },
  });
};
export const useCreateGroupConservationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => messageApi.createGroupConservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['LIST_CONSERVATION'] });
    },
  });
};
export const useCreateMessageMutation = () => {
  return useMutation({
    mutationFn: (data: any) => messageApi.createConversationMessage(data),
    onSuccess: () => {},
  });
};
export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => messageApi.deleteMessage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['LIST_CONSERVATION'] });
    },
  });
};
