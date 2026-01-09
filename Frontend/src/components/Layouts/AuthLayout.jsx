import { Box } from "@chakra-ui/react";

const AuthLayout = ({ children }) => {
  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Box className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
