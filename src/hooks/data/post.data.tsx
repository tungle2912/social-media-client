import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postApi } from '~/services/api/post.api';

export const useGetNewFeedsQuery = () => {
  return useQuery({
    queryKey: ['NEW_FEEDS'],
    queryFn: postApi.getNewFeeds,
    enabled: true,
  });
};
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['POSTS'] });
    },
  });
};
export const useGetPostByUserIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['POSTS'],
    queryFn: () => postApi.getPostByUserId(id),
    enabled: !!id,
  });
};
export const useGetPostByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ['POSTS', id],
    queryFn: () => postApi.getPostById(id),
    enabled: !!id,
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: any }) => postApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['POSTS'] });
    },
  });
};

export const useReactPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => postApi.reactPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['REACT_POST'] });
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
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['POSTS'] });
    },
  });
}
