import { useForm } from "react-hook-form";
import {
  Input,
  Button,
  Textarea,
  Box,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { createPost } from "../services/post.service";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data, isDraft = false) => {
    try {
      const payload = {
        ...data,
        isDraft,
        status: isDraft ? "draft" : "published",
      };

      const res = await createPost(payload);
      navigate(`/posts/${res.data.post._id}`);
    } catch (error) {
      console.error("Create post error:", error);
    }
  };

  return (
    <Box maxW="3xl" mx="auto">
      <Heading mb="6">Create Post</Heading>

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
