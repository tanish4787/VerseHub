import api from "../api/axios";

export const getClaps = (postId) => api.get(`/claps/${postId}/claps`);
export const toggleClap = (postId) => api.post(`/claps/${postId}/clap`);
