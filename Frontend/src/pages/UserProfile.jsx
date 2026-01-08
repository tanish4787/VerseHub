import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, Avatar, Flex, Spinner } from "@chakra-ui/react";
import { fetchUserById } from "@/services/user.service";
import { fetchPostsByUser } from "@/services/post.service";
import PostCard from "@/components/PostCard";
import AuthorCard from "@/components/AuthorCard";

const UserProfile = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetchUserById(userId),
          fetchPostsByUser(userId),
        ]);

        setUser(userRes.data);
        setPosts(postsRes.data.posts || []);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) return <Spinner size="lg" />;
  if (error) return <Text className="text-red-500">{error}</Text>;

  return (
    <Box className="max-w-4xl mx-auto p-4">
      <Box className="border rounded p-6 mb-6">
        <Flex className="items-center gap-4">
          <Avatar size="lg" src={user.profilePicture} />
          <Box>
            <Text className="text-xl font-semibold">{user.username}</Text>
            {user.bio && (
              <Text className="text-sm text-gray-600 mt-1">{user.bio}</Text>
            )}
            <Text className="text-xs text-gray-500 mt-2">
              {user.followers} followers • {user.following} following
            </Text>
          </Box>
        </Flex>
      </Box>

      <AuthorCard author={user} />

      <Box className="mt-6">
        <Text className="text-lg font-semibold mb-4">Posts</Text>

        {posts.length === 0 ? (
          <Text className="text-gray-500">No posts yet.</Text>
        ) : (
          <Box className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;
