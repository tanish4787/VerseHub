import { Box, Text, Flex } from "@chakra-ui/react";

const Footer = () => {
  return (
    <div className="hidden md:block border-b bg-white sticky top-0 z-50">
      <Box className="border-t mt-10 py-6 bg-gray-50">
        <Flex className="max-w-6xl mx-auto px-4 justify-between text-sm text-gray-600">
          <Text>© {new Date().getFullYear()} VerseHub</Text>
          <Text>Built by Tanish K.</Text>
        </Flex>
      </Box>
    </div>
  );
};

export default Footer;
