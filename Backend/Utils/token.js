import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
  } catch (error) {
    console.log("Error gen Token", error);
  }
};
