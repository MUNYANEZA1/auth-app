// File: lib/auth.js
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

// Generate a JWT token for the user
export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Token expires in 7 days
  );
}

// Set the JWT token as a cookie
export function setTokenCookie(res, token) {
  const cookie = serialize("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "strict",
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}

// Remove the auth token cookie (for logout)
export function removeTokenCookie(res) {
  const cookie = serialize("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: -1,
    sameSite: "strict",
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}

// Parse the token from cookies
export function getTokenFromCookies(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const cookieArray = cookies.split(";");
  const authCookie = cookieArray.find((c) => c.trim().startsWith("authToken="));

  if (!authCookie) return null;

  return authCookie.split("=")[1];
}

// Verify and decode the JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Get current user from request
export async function getCurrentUser(req, User) {
  const token = getTokenFromCookies(req);
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  try {
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
}
// This code provides functions for handling JWT authentication in a Node.js application. It includes generating a token, setting it as a cookie, removing the cookie, parsing the token from cookies, verifying the token, and retrieving the current user based on the token. The JWT secret is stored in an environment variable for security.
// The functions are designed to work with a user model, allowing for easy integration into an Express or Next.js application. The token is set to expire in 7 days, and the cookie is configured with security options such as httpOnly and sameSite attributes.