import { Link, useLocation } from "react-router-dom";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import useAuthStore from "@/stores/auth.store";

const MobileNav = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) return null;

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Write", path: "/posts/new" },
    { label: "My Posts", path: "/posts/my-posts" },
    { label: "Bookmarks", path: "/bookmarks" },
    { label: "Profile", path: `/users/${user?._id}` },
  ];

  return (
    <Box className="fixed bottom-0 w-full border-t bg-white z-50 md:hidden">
      <Flex className="justify-around py-2">
        {tabs.map((tab) => (
          <Link key={tab.path} to={tab.path}>
            <Text
              className={`text-sm ${
                location.pathname === tab.path
                  ? "font-semibold text-black"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </Link>
        ))}

        <Button size="sm" variant="outline" onClick={logout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default MobileNav;
