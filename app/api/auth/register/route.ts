// Registration API endpoint
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { ApiResponse } from "@/lib/types";
import clientPromise from "@/lib/mongodb";

// Connect to MongoDB
const connectDB = async () => {
  // If mongoose is already connected, return
  if (mongoose.connections[0].readyState) return;

  // Get the MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/auth-app";

  // Connect to MongoDB
  await mongoose.connect(uri);
};

// POST handler for user registration
export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await req.json();

    // Extract user data from request body
    const {
      firstName,
      lastName,
      age,
      email,
      username,
      password,
      confirmPassword,
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !age ||
      !email ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already in use",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if user with username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      age,
      email,
      username,
      password, // Will be hashed by the pre-save hook in the User model
      profilePictureUrl: "/default-avatar.png", // Default profile picture
    });

    // Save the user to the database
    await newUser.save();

    // Return success response without sensitive data
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          age: newUser.age,
          email: newUser.email,
          username: newUser.username,
          profilePictureUrl: newUser.profilePictureUrl,
        },
      } as ApiResponse,
      { status: 201 }
    );
  } catch (error: any) {
    // Handle errors
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
        error: error.message,
      } as ApiResponse,
      { status: 500 }
    );
  }
}
