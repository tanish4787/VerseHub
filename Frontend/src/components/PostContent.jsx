import { Box, Text } from "@chakra-ui/react";

const PostContent = ({ content }) => {
  return (
    <Box className="prose max-w-none mt-4">
      <Text whiteSpace="pre-line">{content}</Text>
    </Box>
  );
};

export default PostContent;
