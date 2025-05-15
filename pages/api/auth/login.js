// File: pages/api/auth/login.js
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";
import { generateToken, setTokenCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Extract login credentials
    const { email, password } = req.body;

    // Find the user by email and explicitly select the password field
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set the token as a cookie
    setTokenCookie(res, token);

    // Return user data (excluding password)
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
