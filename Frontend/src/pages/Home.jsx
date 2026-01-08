import { useEffect, useState } from "react";
import {
  SimpleGrid,
  Spinner,
  Box,
  Input,
  Text,
  Button,
} from "@chakra-ui/react";
import { fetchPosts, fetchTrendingPosts } from "../services/post.service";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [view, setView] = useState("latest"); 

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    setView("latest");
    setPage(1);
    setPosts([]);
  };

  useEffect(() => {
    if (view === "trending") return;

    const loadPosts = async () => {
      try {
        setLoading(true);

        const res = await fetchPosts({
          search,
          tag: activeTag,
          page,
          limit: 6,
        });

        const newPosts = res.data.posts || [];

        if (page === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        setHasMore(page < res.data.totalPages);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [search, activeTag, page, view]);

  const loadTrending = async () => {
    try {
      setLoading(true);
      setView("trending");

      const res = await fetchTrendingPosts();
      setPosts(res.data.posts || []);
      setHasMore(false);
    } catch (error) {
      console.error("Failed to load trending posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-5xl mx-auto p-4">
      <Box className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={view === "latest" ? "solid" : "outline"}
          onClick={() => {
            setView("latest");
            setPage(1);
            setPosts([]);
          }}
        >
          Latest
        </Button>

        <Button
          size="sm"
          variant={view === "trending" ? "solid" : "outline"}
          onClick={loadTrending}
        >
          Trending
        </Button>
      </Box>

      {view === "latest" && (
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
            setPosts([]);
          }}
          className="mb-4"
        />
      )}

      {activeTag && view === "latest" && (
        <Box className="mb-4 flex items-center gap-2">
          <Text className="text-sm text-gray-600">
            Filtering by tag: <strong>#{activeTag}</strong>
          </Text>
          <Button size="xs" onClick={() => setActiveTag(null)}>
            Clear
          </Button>
        </Box>
      )}

      {loading && posts.length === 0 ? (
        <Box textAlign="center" mt="20">
          <Spinner size="xl" />
        </Box>
      ) : posts.length === 0 ? (
        <Text className="text-gray-500">No posts found.</Text>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onTagClick={handleTagClick}
              />
            ))}
          </SimpleGrid>

          {hasMore && view === "latest" && (
            <Box textAlign="center" mt="6">
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                isLoading={loading}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
