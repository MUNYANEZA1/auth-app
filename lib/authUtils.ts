// Authentication utility functions
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// Type definition for JWT payload
export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

// Function to generate a JWT token for authenticated users
export const generateToken = (payload: JWTPayload): string => {
  // Get the JWT secret from environment variables
  const secret = process.env.JWT_SECRET || "fallback_secret_not_for_production";

  // Sign the token with the payload and set expiration to 7 days
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

// Function to verify a JWT token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    // Get the JWT secret from environment variables
    const secret =
      process.env.JWT_SECRET || "fallback_secret_not_for_production";

    // Verify the token and return the decoded payload
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    // Return null if token verification fails
    return null;
  }
};

// Function to extract the token from the request cookies
export const getTokenFromRequest = (req: NextRequest): string | null => {
  // Get the token from the cookie
  const token = req.cookies.get("auth-token")?.value;

  return token || null;
};

// Function to get the current user ID from the request
export const getCurrentUserId = (req: NextRequest): string | null => {
  // Get the token from the request
  const token = getTokenFromRequest(req);

  if (!token) return null;

  // Verify the token and extract the user ID
  const payload = verifyToken(token);

  return payload?.userId || null;
};
