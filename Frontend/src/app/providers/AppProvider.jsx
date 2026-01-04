import { ChakraUIProvider } from "./ChakraProvider";
import { QueryProvider } from "./QueryProvider";
import { BrowserRouter } from "react-router-dom";

export const AppProvider = ({ children }) => (
  <BrowserRouter>
    <QueryProvider>
      <ChakraUIProvider>{children}</ChakraUIProvider>
    </QueryProvider>
  </BrowserRouter>
);
