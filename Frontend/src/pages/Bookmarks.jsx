import { useEffect, useState } from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { getBookmarks } from "@/services/bookmark.service";
import PostCard from "@/components/PostCard";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const res = await getBookmarks();
        setBookmarks(res.data.bookmarks || []);
      } catch (err) {
        console.error("Failed to load bookmarks", err);
        setError("Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  if (loading) return <Spinner size="lg" />;
  if (error) return <Text className="text-red-500">{error}</Text>;

  return (
    <Box className="max-w-4xl mx-auto p-4">
      <Text className="text-xl font-semibold mb-4">Your Bookmarks</Text>

      {bookmarks.length === 0 ? (
        <Text className="text-gray-500">
          You haven’t bookmarked any posts yet.
        </Text>
      ) : (
        <Box className="space-y-4">
          {bookmarks.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Bookmarks;
