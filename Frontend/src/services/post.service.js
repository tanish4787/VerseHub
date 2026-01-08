import api from "../api/axios";


export const fetchPostById = (postId) => {
  return api.get(`/posts/${postId}`);
};

export const createPost = (data) => {
  return api.post("/posts", data);
};

export const updatePost = (postId, data) => {
  return api.put(`/posts/${postId}`, data);
};
export const deletePost = (postId) => {
  return api.delete(`/posts/${postId}`);
};

export const fetchMyPosts = () => api.get("/posts/me");

export const fetchPostsByUser = (userId) => api.get(`/posts/user/${userId}`);

export const fetchPosts = (params = {}) => api.get("/posts", { params });

export const fetchTrendingPosts = () => api.get("/posts/trending");
