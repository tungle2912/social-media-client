import { sendDelete, sendGet, sendPatch, sendPost, sendPut } from '~/api/request';
import { IPost } from '~/definitions/interfaces/post.interface';


export const postApi = {
  createPost: (data: IPost) => {
    return sendPost('/api/posts', data);
  },
  getPostByUserId: (id: string): Promise<{ result: IPost[]; message: string }> => {
    return sendGet(`/api/posts/user/${id}`);
  },
  getNewFeeds: () => {
    return sendGet('api/posts/new-feeds');
  },
  getPostById: (id: string) => {
    return sendGet(`/api/posts/${id}`);
  },
  updatePost: (id: string, data?: any) => {
    return sendPut(`/api/posts/${id}`, data);
  },
  reactPost: (data: any) => {
    return sendPost('/api/reacts', data);
  },
  commentPost: (data: any) => {
    return sendPost('/api/comments', data);
  },
  createHashTag: (data: any) => {
    return sendPost('/api/hashtags', data);
  },
  deletePost: (id: string) => {
    return sendDelete(`/api/posts/${id}`);
  }
};
