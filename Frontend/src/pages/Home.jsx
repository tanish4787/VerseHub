import { useEffect, useState } from "react";
import { SimpleGrid, Spinner, Box } from "@chakra-ui/react";
import { fetchPosts } from "../services/post.service";
import PostCard from "../components/PostCard"
export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetchPosts();
        setPosts(res.data.posts || []);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </SimpleGrid>
  );
}

