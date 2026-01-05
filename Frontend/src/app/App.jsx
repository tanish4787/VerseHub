import React from "react";
import AppRoutes from "./Routes";
import useAuthHydration from "@/hooks/useAuthHydration";
const App = () => {
  useAuthHydration();
  return <AppRoutes />;
};

export default App;
