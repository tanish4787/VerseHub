import api from "../api/axios";

export const fetchComments = (postId) =>
  api.get(`/comments/${postId}/comments`);

export const addComment = (postId, data) =>
  api.post(`/comments/${postId}/comments`, data);

export const deleteComment = (commentId) =>
  api.delete(`/comments/comments/${commentId}`);
