import { useForm } from "react-hook-form";
import { Input, Button, Textarea, Box, Heading, HStack } from "@chakra-ui/react";
import { fetchPostById, updatePost } from "../services/post.service";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function EditPost() {
  const { postId } = useParams();
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      const res = await fetchPostById(postId);
      setValue("title", res.data.post.title);
      setValue("content", res.data.post.content);
    };
    loadPost();
  }, [postId, setValue]);

  const onSubmit = async (data, isDraft = false) => {
    try {
      const payload = {
        ...data,
        isDraft,
        status: isDraft ? "draft" : "published",
      };

      await updatePost(postId, payload);
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error("Update post error:", error);
    }
  };

  return (
    <Box maxW="3xl" mx="auto">
      <Heading mb="6">Edit Post</Heading>

      <form>
        <Input
          placeholder="Post Title"
          mb="4"
          {...register("title", { required: true })}
        />

        <Textarea
          placeholder="Write your content here..."
          rows={10}
          mb="4"
          {...register("content", { required: true })}
        />

        <HStack spacing="4">
          <Button
            colorScheme="gray"
            onClick={handleSubmit((data) => onSubmit(data, true))}
          >
            Save as Draft
          </Button>

          <Button
            colorScheme="blue"
            onClick={handleSubmit((data) => onSubmit(data, false))}
          >
            Publish
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
