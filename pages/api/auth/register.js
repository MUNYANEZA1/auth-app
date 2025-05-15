// File: pages/api/auth/register.js
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

    // Extract user details from request body
    const {
      firstName,
      lastName,
      age,
      email,
      username,
      profilePicture,
      password,
      confirmPassword,
    } = req.body;

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists with the same email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      age,
      email,
      username,
      profilePicture: profilePicture || "/default-avatar.png",
      password,
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Set the token as a cookie
    setTokenCookie(res, token);

    // Return user data (excluding sensitive information)
    return res.status(201).json({
      message: "User registered successfully",
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
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
// This code defines an API endpoint for user registration. It connects to the database, validates the input data, checks for existing users, creates a new user, generates a JWT token, and sets it as a cookie. If any errors occur during this process, appropriate error messages are returned.
// This code defines an API endpoint for user registration. It connects to the database, validates the input data, checks for existing users, creates a new user, generates a JWT token, and sets it as a cookie. If any errors occur during this process, appropriate error messages are returned.