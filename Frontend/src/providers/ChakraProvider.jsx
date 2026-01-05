import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/chakraTheme";

export const ChakraUIProvider = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
