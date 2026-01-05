import { Box, Text } from "@chakra-ui/react"

export default function Footer() {
  return (
    <Box
      bg="gray.100"
      py="4"
      mt="auto"
      borderTop="1px solid"
      borderColor="gray.200"
    >
      <Text textAlign="center" fontSize="sm" color="gray.600">
        © {new Date().getFullYear()} VerseHub
      </Text>
    </Box>
  )
}
