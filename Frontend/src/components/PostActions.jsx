import { useEffect, useState } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { getClaps, toggleClap } from "@/services/clap.service";
import { getBookmarks, toggleBookmark } from "@/services/bookmark.service";

const PostActions = ({ postId }) => {
  const [claps, setClaps] = useState(0);
  const [hasClapped, setHasClapped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const clapRes = await getClaps(postId);
      setClaps(clapRes.data.total);
      setHasClapped(clapRes.data.hasClapped);

      const bookmarkRes = await getBookmarks(postId);
      setIsBookmarked(bookmarkRes.data.isBookmarked);
    };

    hydrate();
  }, [postId]);

  const handleClap = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await toggleClap(postId);
      setHasClapped(res.data.hasClapped);
      setClaps(res.data.clapsCount);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    const res = await toggleBookmark(postId);
    setIsBookmarked(res.data.isBookmarked);
  };

  return (
    <Flex className="gap-2 my-4">
      <Button
        size="sm"
        onClick={handleClap}
        className={hasClapped ? "bg-black text-white" : "bg-gray-100"}
      >
        👏 {claps}
      </Button>

      <Button
        size="sm"
        onClick={handleBookmark}
        className={isBookmarked ? "bg-yellow-400" : "bg-gray-100"}
      >
        🔖
      </Button>
    </Flex>
  );
};

export default PostActions;
