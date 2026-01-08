import { useEffect, useState } from "react";
import { Box, Text, Button, Flex, Avatar } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { toggleFollow, getFollowStatus } from "@/services/user.service";
import useAuthStore from "../stores/auth.store";

const AuthorCard = ({ author }) => {
  const { user } = useAuthStore();

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const isOwnProfile = user?._id === author._id;

  useEffect(() => {
    if (isOwnProfile) return;

    const hydrate = async () => {
      try {
        const res = await getFollowStatus(author._id);
        setIsFollowing(res.data.isFollowing);
        setFollowersCount(res.data.followersCount);
      } catch (err) {
        console.error("Failed to load follow state", err);
      }
    };

    hydrate();
  }, [author._id, isOwnProfile]);

  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await toggleFollow(author._id);
      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
    } catch (err) {
      console.error("Follow action failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="border rounded p-4 mt-8">
      <Flex className="items-center justify-between">
        <Flex className="items-center gap-3">
          <Avatar size="sm" src={author.profilePicture} />
          <Box>
            <Link to={`/users/${author._id}`}>
              <Text className="font-semibold hover:underline">
                {author.username}
              </Text>
            </Link>
            <Text className="text-xs text-gray-500">
              {followersCount} followers
            </Text>
          </Box>
        </Flex>

        {!isOwnProfile && (
          <Button
            size="sm"
            onClick={handleFollow}
            isLoading={loading}
            className={
              isFollowing ? "bg-gray-200 text-black" : "bg-black text-white"
            }
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default AuthorCard;
