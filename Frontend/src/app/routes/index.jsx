import { Routes, Route } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<div>Register</div>} />

      {/* Protected */}
      <Route path="/" element={<div>Home</div>} />
    </Routes>
  );
};
