import { useEffect, useState } from "react";
import { Box, Button, Textarea, Text } from "@chakra-ui/react";
import {
  addComment,
  deleteComment,
  fetchComments,
} from "@/services/comment.service";
import CommentItem from "./CommentItem";

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await fetchComments(postId);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };

    loadComments();
  }, [postId]);

  const handleAdd = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await addComment(postId, { content });
      setComments((prev) => [res.data.comment, ...prev]);
      setContent("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <Box className="mt-8">
      <Text className="text-lg font-semibold mb-2">Comments</Text>

      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-2"
      />

      <Button
        size="sm"
        onClick={handleAdd}
        isLoading={loading}
        className="bg-black text-white"
      >
        Post Comment
      </Button>

      <Box className="mt-4 space-y-4 ">
        {comments.length === 0 ? (
          <Text className="text-gray-500 text-sm">No comments yet.</Text>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default CommentsSection;
