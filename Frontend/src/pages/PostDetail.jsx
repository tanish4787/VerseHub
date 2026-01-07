import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner } from "@chakra-ui/react";
import { fetchPostById } from "@/services/post.service";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetchPostById(postId);
        setPost(res.data.post);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  if (loading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!post) {
    return <Text>Post not found</Text>;
  }

  return (
    <Box maxW="3xl" mx="auto">
      <Heading mb="2">{post.title}</Heading>

      <Text fontSize="sm" color="gray.600" mb="6">
        by {post.authorInfo?.username || "Unknown"}
      </Text>

      <Box whiteSpace="pre-line">{post.content}</Box>
    </Box>
  );
};

export default PostDetail;
