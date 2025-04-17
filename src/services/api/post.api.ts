import { sendGet, sendPatch, sendPost } from '~/api/request';

export const postApi = {
  getNewFeeds: () => {
    return sendGet('api/posts/new-feeds');
  },
  getPostById: (id: string) => {
    return sendGet(`/api/posts/${id}`);
  },
  updatePost: (id: string, data?: any) => {
    return sendPatch(`/api/posts/${id}`, data);
  },
  reactPost: (data: any) => {
    return sendPost('/api/reacts', data);
  },
  commentPost: (data: any) => {
    return sendPost('/api/comments', data);
  },
  createHashTag: (data: any) => {
    return sendPost('/api/hashtags', data);
  }
};
