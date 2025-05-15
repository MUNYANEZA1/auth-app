// File: pages/api/user/update.js
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";
import { getCurrentUser } from "../../../lib/auth";

export default async function handler(req, res) {
  // Only allow PUT requests
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Get the current authenticated user
    const currentUser = await getCurrentUser(req, User);

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract fields to update
    const { firstName, lastName, age, username, profilePicture } = req.body;

    // Check if updating username and if it's already taken by another user
    if (username && username !== currentUser.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    // Update the user
    currentUser.firstName = firstName || currentUser.firstName;
    currentUser.lastName = lastName || currentUser.lastName;
    currentUser.age = age || currentUser.age;
    currentUser.username = username || currentUser.username;
    currentUser.profilePicture = profilePicture || currentUser.profilePicture;

    // Save the updated user
    await currentUser.save();

    // Return the updated user data
    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        age: currentUser.age,
        email: currentUser.email,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
// This code defines an API endpoint for updating the user's profile information. It connects to the database, retrieves the current authenticated user, and updates the user's profile data based on the request body. If any errors occur during this process, appropriate error messages are returned.
// This code is part of a larger authentication system for a web application. It handles user registration, login, profile retrieval, and logout functionalities using JWT tokens and cookies for session management.