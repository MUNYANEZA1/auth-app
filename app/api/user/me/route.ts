// User management API endpoint
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { ApiResponse } from "@/lib/types";
import { getCurrentUserId } from "@/lib/authUtils";

// Connect to MongoDB
const connectDB = async () => {
  // If mongoose is already connected, return
  if (mongoose.connections[0].readyState) return;

  // Get the MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/auth-app";

  // Connect to MongoDB
  await mongoose.connect(uri);
};

// GET handler to fetch current user data
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get the current user ID from the request
    const userId = getCurrentUserId(req);

    // If no user ID is found, return unauthorized
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Find the user by ID
    const user = await User.findById(userId).select("-password");

    // If user not found, return error
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json(
      {
        success: true,
        message: "User data retrieved successfully",
        data: user,
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    // Handle errors
    console.error("Get user error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve user data",
        error: error.message,
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// PUT handler to update user data
export async function PUT(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get the current user ID from the request
    const userId = getCurrentUserId(req);

    // If no user ID is found, return unauthorized
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Extract update data from request body
    const { firstName, lastName, age, username } = body;

    // Create update object with only provided fields
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (age !== undefined) updateData.age = age;
    if (username !== undefined) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Username already taken",
          } as ApiResponse,
          { status: 400 }
        );
      }
      updateData.username = username;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    // If user not found, return error
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Return updated user data
    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    // Handle errors
    console.error("Update user error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
        error: error.message,
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// DELETE handler to delete user account
export async function DELETE(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get the current user ID from the request
    const userId = getCurrentUserId(req);

    // If no user ID is found, return unauthorized
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    // If user not found, return error
    if (!deletedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      } as ApiResponse,
      { status: 200 }
    );

    // Clear the auth token cookie
    response.cookies.set({
      name: "auth-token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (error: any) {
    // Handle errors
    console.error("Delete user error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        error: error.message,
      } as ApiResponse,
      { status: 500 }
    );
  }
}
