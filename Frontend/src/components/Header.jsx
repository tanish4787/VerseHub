import { Link } from "react-router-dom";
import { Box, Flex, Button, Avatar } from "@chakra-ui/react";
import useAuthStore from "../stores/auth.store";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
      <Flex
        maxW="1200px"
        mx="auto"
        px="4"
        py="3"
        align="center"
        justify="space-between"
      >
        <Link to="/">
          <strong>VerseHub</strong>
        </Link>

        <Flex align="center" gap="3">
          <Button size="sm" variant="ghost" as={Link} to="/">
            Home
          </Button>
          <Button size="sm" colorScheme="blue" as={Link} to="/posts/new">
            Write
          </Button>

          {user && (
            <>
              <Avatar size="sm" name={user.username} />
              <Button size="sm" colorScheme="red" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
