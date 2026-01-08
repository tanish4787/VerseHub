import api from "../api/axios";

export const toggleBookmark = (postId) => api.post(`/bookmarks/${postId}`);
export const getBookmarks = () => api.get("/bookmarks");
