// Login API endpoint
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { ApiResponse } from "@/lib/types";
import { generateToken } from "@/lib/authUtils";

// Connect to MongoDB
const connectDB = async () => {
  // If mongoose is already connected, return
  if (mongoose.connections[0].readyState) return;

  // Get the MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/auth-app";

  // Connect to MongoDB
  await mongoose.connect(uri);
};

// POST handler for user login
export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await req.json();

    // Extract login credentials from request body
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    // If password is invalid, return error
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          email: user.email,
          username: user.username,
          profilePictureUrl: user.profilePictureUrl,
        },
      } as ApiResponse,
      { status: 200 }
    );

    // Set the token as an HTTP-only cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    // Handle errors
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
        error: error.message,
      } as ApiResponse,
      { status: 500 }
    );
  }
}
