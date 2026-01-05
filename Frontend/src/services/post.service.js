import api from "@/api/axios";

export const getAllPosts = () => {
  return api.get("");
};

export const createPost = ({
  title,
  content,
  featuredImage,
  tags,
  isDraft,
  status,
}) => {
  return api.post("/", tags, content, isDraft, status, featuredImage, title);
};
