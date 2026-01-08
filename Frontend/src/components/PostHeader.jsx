import { Box, Text } from "@chakra-ui/react";

const PostHeader = ({ post }) => {
  return (
    <Box className="mb-4">
      <Text className="text-2xl font-bold">{post.title}</Text>
      <Text className="text-sm text-gray-500 mt-1">
        by {post.authorInfo?.username} •{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </Text>
    </Box>
  );
};

export default PostHeader;
