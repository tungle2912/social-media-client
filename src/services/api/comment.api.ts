import { create, get } from 'lodash';
import { sendGet, sendPatch, sendPost } from '~/api/request';

export const commentApi = {
  getComments: (postId: string, page: number, limit: number) => {
    return sendGet(`/api/posts/${postId}/comments`, {
      page,
      limit,
    });
  },
  createComment: (data: any) => {
    return sendPost(`/api/comments/`, data);
  },
  updateComment: (commentId: string, data: any) => {
    return sendPatch(`/api/comments/${commentId}`, data);
  },
  deleteComment: (commentId: string) => {
    return sendPost(`/api/comments/${commentId}`);
  },
};
