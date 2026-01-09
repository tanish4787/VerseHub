import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Text, Box } from "@chakra-ui/react";
import AuthLayout from "@/components/Layouts/AuthLayout";
import { loginUser } from "@/services/auth.service";
import useAuthStore from "@/stores/auth.store";

const Login = () => {
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      loginSuccess({ user: res.data.user, token: res.data.token });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Text className="text-2xl font-semibold mb-1 text-center">
        Welcome back
      </Text>
      <Text className="text-sm text-gray-500 mb-6 text-center">
        Log in to continue to VerseHub
      </Text>

      {error && (
        <Box className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </Box>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Text className="text-sm text-right">
          <Link to="/forgot-password" className="text-black hover:underline">
            Forgot password?
          </Link>
        </Text>

        <Button
          type="submit"
          width="full"
          isLoading={loading}
          className="bg-black text-white hover:bg-gray-800"
        >
          Login
        </Button>
      </form>

      <Text className="text-sm text-gray-600 mt-6 text-center">
        Don’t have an account?{" "}
        <Link to="/register" className="text-black font-medium hover:underline">
          Sign up
        </Link>
      </Text>
    </AuthLayout>
  );
};

export default Login;
