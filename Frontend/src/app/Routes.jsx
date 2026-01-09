import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import CreatePost from "@/pages/CreatePost";
import EditPost from "@/pages/EditPost";
import PostDetail from "@/pages/PostDetail";
import UserProfile from "@/pages/UserProfile";
import ForgotPassword from "@/pages/ForgotPassword";


import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/Layouts/MainLayout";
import MyPosts from "@/pages/MyPosts";
import Bookmarks from "@/pages/Bookmarks";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/posts/my-posts" element={<MyPosts />} />
        <Route path="/posts/new" element={<CreatePost />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route path="/posts/:postId/edit" element={<EditPost />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/users/:userId" element={<UserProfile />} />


      </Route>
    </Routes>
  );
};

export default AppRoutes;
 