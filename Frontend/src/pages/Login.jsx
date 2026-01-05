import { useForm } from "react-hook-form";
import { Input, Button, Box, Heading } from "@chakra-ui/react";
import  useAuthStore  from "../stores/auth.store";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const auth = useAuthStore();

  const onSubmit = async (data) => {
    try {
      auth.loginStart();
      const res = await loginUser(data);
      auth.loginSuccess(res.data);
      navigate("/");
    } catch (err) {
      console.error("Error while loggin in: ", err);
      auth.loginFailure("Invalid credentials");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="20">
      <Heading mb="6">Login</Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Email"
          mb="4"
          {...register("email", { required: true })}
        />

       

        <Input
          type="password"
          placeholder="Password"
          mb="4"
          {...register("password", { required: true })}
        />

        <Button
          type="submit"
          colorScheme="blue"
          width="100%"
          isLoading={auth.loading}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}
