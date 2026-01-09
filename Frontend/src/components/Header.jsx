import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import useAuthStore from "@/stores/auth.store";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="hidden md:block border-b bg-white sticky top-0 z-50">
      <Box className="border-b bg-white sticky top-0 z-50">
        <Flex className="max-w-6xl mx-auto px-4 py-3 items-center justify-between">
          <Link to="/">
            <Text className="text-xl font-bold">VerseHub</Text>
          </Link>

          <Flex className="items-center gap-4">
            {isAuthenticated && (
              <>
                <Link to="/">Home</Link>
                <Link to="/posts/my-posts">My Posts</Link>
                <Link to="/bookmarks">Bookmarks</Link>
              </>
            )}

            {!isAuthenticated ? (
              <>
                <Link to="/login">Login</Link>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Link to={`/users/${user?._id}`}>{user?.username}</Link>
                <Button size="sm" variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    </div>
  );
};

export default Header;
