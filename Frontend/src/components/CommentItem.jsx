import { Box, Text, Button, Flex } from "@chakra-ui/react";
import useAuthStore from "@/stores/auth.store";

const CommentItem = ({ comment, onDelete }) => {
  const { user } = useAuthStore();

  const canDelete =
    user &&
    (user._id === comment.userInfo?._id || user._id === comment.postAuthor);

  return (
    <Box className="border rounded p-3">
      <Flex className="justify-between items-center mb-1">
        <Text className="text-sm font-medium">
          {comment.userInfo?.username}
        </Text>

        {canDelete && (
          <Button
            size="xs"
            variant="ghost"
            color="red.500"
            onClick={() => onDelete(comment._id)}
          >
            Delete
          </Button>
        )}
      </Flex>

      <Text className="text-sm text-gray-700">{comment.content}</Text>
    </Box>
  );
};

export default CommentItem;
