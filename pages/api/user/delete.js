// File: pages/api/user/delete.js
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";
import { getCurrentUser, removeTokenCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== "DELETE") {
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

    // Delete the user
    await User.findByIdAndDelete(currentUser._id);

    // Clear the auth token cookie
    removeTokenCookie(res);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
// This code defines an API endpoint for deleting a user account. It connects to the database, retrieves the current authenticated user, deletes the user from the database, and clears the authentication token cookie. If any errors occur during this process, appropriate error messages are returned.
// This code is part of a larger authentication system for a web application. It handles user registration, login, profile retrieval, and logout functionalities using JWT tokens and cookies for session management.