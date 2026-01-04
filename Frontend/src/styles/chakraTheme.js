import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Inter, system-ui",
    body: "Inter, system-ui",
  },
  colors: {
    brand: {
      500: "#6366F1",
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
});
