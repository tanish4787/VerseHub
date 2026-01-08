import api from "../api/axios";

export const toggleFollow = (userId) => api.post(`/users/${userId}/follow`);

export const fetchUserById = (userId) => api.get(`/users/${userId}`);

export const getFollowStatus = (userId) =>
  api.get(`/users/${userId}/follow-status`);
