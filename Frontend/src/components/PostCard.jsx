import { Box, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p="4"
      bg="white"
    >
      <Link to={`/posts/${post._id}`}>
        <Heading size="md" mb="2">
          {post.title}
        </Heading>
      </Link>

      <Text fontSize="sm" color="gray.600">
        by {post.author?.username || "Unknown"}
      </Text>

      <Text mt="2" noOfLines={3}>
        {post.excerpt || ""}
      </Text>
    </Box>
  );
}
