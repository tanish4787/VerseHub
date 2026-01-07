import api from "../api/axios";

export const fetchPosts = () => {
  return api.get("/posts");
};

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
