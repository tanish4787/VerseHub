import User from "../../Models/User.Model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../Utils/token.js";
import crypto from "crypto";
import transporter from "../../Configs/emailConfig.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if ((!username && !email) || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Already registered. Please login." });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      error: error.message || "Registration failed",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ error: "User not Registered." });
    }

    const pass = await bcrypt.compare(password, existingUser.password);
    if (!pass) {
      return res.status(401).json({ error: "Invalid Credentials." });
    }

    const token = generateToken(existingUser._id);

    res.status(201).json({
      message: "User Logged in Successfully",
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
      token,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ error: "Internal Server Error." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ error: "Unauthorised." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    existingUser.resetPasswordToken = hashedToken;
    existingUser.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await existingUser.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"VerseHub Support" <${process.env.EMAIL_USER}>`,
      to: existingUser.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
    });

    res.status(200).json({ message: "Reset link sent successfully." });
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    user.password = hashedPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Password reset successful.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log("Reset password error:", error);
    res.status(500).json({ error: "Server error during password reset." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token: rawToken } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({
      verifyEmailToken: hashedToken,
      verifyEmailExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token." });
    }

    user.isVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Server error during verification." });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Failed to logout." });
  }
};
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
