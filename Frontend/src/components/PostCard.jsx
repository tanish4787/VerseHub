import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Text, Badge, Flex } from "@chakra-ui/react";
import { getClaps, toggleClap } from "@/services/clap.service";
import { toggleBookmark } from "@/services/bookmark.service";

const PostCard = ({ post, onTagClick }) => {
  const [claps, setClaps] = useState(0);
  const [hasClapped, setHasClapped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClapState = async () => {
      try {
        const res = await getClaps(post._id);
        setClaps(res.data.total);
        setHasClapped(res.data.hasClapped);
      } catch (err) {
        console.error("Failed to fetch clap state", err);
      }
    };

    fetchClapState();
  }, [post._id]);

  const handleClap = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await toggleClap(post._id);
      setHasClapped(res.data.hasClapped);
      setClaps(res.data.clapsCount);
    } catch (err) {
      console.error("Clap action failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await toggleBookmark(post._id);
      setIsBookmarked(res.data.isBookmarked);
    } catch (err) {
      console.error("Bookmark failed", err);
    }
  };

  return (
    <Box className="bg-white border rounded-lg p-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
      <Box className="flex-1">
        <Link to={`/posts/${post._id}`}>
          <Text className="text-lg font-semibold hover:underline">
            {post.title}
          </Text>
        </Link>

        <Text className="text-sm text-gray-600 mt-1">
          by {post.authorInfo?.username} • {post.readingTime}
        </Text>

        <Text className="text-gray-800 mt-2 line-clamp-3">{post.content}</Text>

        <Flex className="flex-wrap gap-2 mt-2">
          {post.tags?.map((tag) => (
            <Text
              key={tag}
              className="text-xs text-blue-500 cursor-pointer hover:underline"
              onClick={() => onTagClick?.(tag)}
            >
              #{tag}
            </Text>
          ))}
        </Flex>
      </Box>

      <Flex className="flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleClap}
          isLoading={loading}
          className={hasClapped ? "bg-black text-white" : "bg-gray-100"}
        >
          👏 {claps}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleBookmark}
          className={isBookmarked ? "bg-yellow-400 text-black" : "bg-gray-100"}
        >
          🔖
        </Button>

        {post.isDraft && (
          <Badge className="bg-gray-200 text-gray-800 text-xs">Draft</Badge>
        )}
      </Flex>
    </Box>
  );
};

export default PostCard;
