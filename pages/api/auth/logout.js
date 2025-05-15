// File: pages/api/auth/logout.js
import { removeTokenCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Clear the auth token cookie
    removeTokenCookie(res);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
// This code defines an API endpoint for logging out the user. It clears the authentication token cookie and returns a success message. If any errors occur during this process, appropriate error messages are returned.
// This code is part of a larger authentication system for a web application. It handles user registration, login, profile retrieval, and logout functionalities using JWT tokens and cookies for session management.