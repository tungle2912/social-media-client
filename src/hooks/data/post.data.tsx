import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postApi } from '~/services/api/post.api';

export const useGetNewFeedsQuery = () => {
  return useQuery({
    queryKey: ['NEW_FEEDS'],
    queryFn: postApi.getNewFeeds,
    enabled: true,
  });
};

export const useGetPostByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['POST', id],
    queryFn: () => postApi.getPostById(id),
    enabled: !!id,
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => postApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['POST'] });
      queryClient.invalidateQueries({ queryKey: ['NEW_FEEDS'] });
    },
  });
};

export const useReactPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postApi.reactPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['POST'] });
    },
  });
};

export const useCommentPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postApi.commentPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['POST'] });
    },
  });
};

export const useCreateHashTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postApi.createHashTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['HASHTAGS'] });
    },
  });
};