import { useState } from "react";
import { Input, Button, Text, Box } from "@chakra-ui/react";
import AuthLayout from "@/components/Layouts/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // later: call backend forgot-password API
      setMessage("If an account exists, a reset link has been sent.");
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Text className="text-2xl font-semibold mb-1 text-center">
        Reset your password
      </Text>
      <Text className="text-sm text-gray-500 mb-6 text-center">
        Enter your email to receive a reset link
      </Text>

      {message && (
        <Box className="mb-4 text-sm text-green-700 bg-green-50 p-2 rounded">
          {message}
        </Box>
      )}

      {error && (
        <Box className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </Box>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          type="submit"
          width="full"
          isLoading={loading}
          className="bg-black text-white hover:bg-gray-800"
        >
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
