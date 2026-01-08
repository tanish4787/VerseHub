import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { fetchPostById } from "@/services/post.service";

import PostHeader from "@/components/PostHeader";
import PostActions from "@/components/PostActions";
import PostContent from "@/components/PostContent";
import AuthorCard from "@/components/AuthorCard";
import CommentsSection from "@/components/CommentsSection";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetchPostById(postId);
        setPost(res.data.post);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("This draft is private.");
        } else {
          setError("Failed to load post.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postId]);

  if (loading) {
    return (
      <Box className="flex justify-center py-10">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (error) return <Text className="text-red-500">{error}</Text>;
  if (!post) return null;

  return (
    <Box className="max-w-3xl mx-auto p-4">
      <PostHeader post={post} />
      <PostActions postId={post._id} />
      <PostContent content={post.content} />
      <AuthorCard author={post.authorInfo} />
      <CommentsSection postId={post._id} />
    </Box>
  );
};

export default PostDetail;
