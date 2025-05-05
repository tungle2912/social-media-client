import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '~/services/api/comment.api';

export const useCreateCommentMutation = (postId: string) => {
  return useMutation({
    mutationFn: (data: any) => commentApi.createComment(data),
  });
};

// Hook để cập nhật bình luận
export const useUpdateCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: { content: string } }) =>
      commentApi.updateComment(commentId, data),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['COMMENTS', postId],
      });
    },
  });
};

// Hook để xóa bình luận
export const useDeleteCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentApi.deleteComment(commentId),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['COMMENTS', postId],
      });
    },
  });
};
