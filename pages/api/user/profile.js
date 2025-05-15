// File: pages/api/user/profile.js
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";
import { getCurrentUser } from "../../../lib/auth";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
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

    // Return the user profile data
    return res.status(200).json({
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
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
// This code defines an API endpoint for retrieving the user's profile information. It connects to the database, retrieves the current authenticated user, and returns the user's profile data. If any errors occur during this process, appropriate error messages are returned.
