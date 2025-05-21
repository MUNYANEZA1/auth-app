// Profile picture upload API endpoint
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { ApiResponse } from "@/lib/types";
import { getCurrentUserId } from "@/lib/authUtils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Connect to MongoDB
const connectDB = async () => {
  // If mongoose is already connected, return
  if (mongoose.connections[0].readyState) return;

  // Get the MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/auth-app";

  // Connect to MongoDB
  await mongoose.connect(uri);
};

// Ensure directory exists
async function ensureDirExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    try {
      await mkdir(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}`);
    } catch (error: any) {
      console.error(`Error creating directory: ${dirPath}`, error);
      throw new Error(`Failed to create directory: ${error.message}`);
    }
  }
}

// POST handler for profile picture upload
export async function POST(req: NextRequest) {
  try {
    console.log("Profile picture upload - request received");

    // Connect to the database
    await connectDB();
    console.log("Database connected");

    // Get the current user ID from the request
    const userId = getCurrentUserId(req);
    console.log("User ID:", userId);

    // If no user ID is found, return unauthorized
    if (!userId) {
      console.log("Unauthorized - No user ID found");
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Find the user by ID
    const user = await User.findById(userId);
    console.log("User found:", !!user);

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

    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;
    console.log("File received:", !!file, file ? file.name : "No file");

    // If no file is provided, return error
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Get file extension
    const fileExt = file.name.split(".").pop() || "jpg";

    // Create a unique filename
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    console.log("Generated filename:", fileName);

    // Define the path to save the file
    const publicDir = path.join(process.cwd(), "public");
    const uploadsDir = path.join(publicDir, "uploads");
    const filePath = path.join(uploadsDir, fileName);

    console.log("File paths:", {
      publicDir,
      uploadsDir,
      filePath,
    });

    // Create uploads directory if it doesn't exist
    try {
      // Ensure uploads directory exists
      await ensureDirExists(uploadsDir);

      // Convert file to buffer and write to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      console.log("File written successfully");
    } catch (error: any) {
      console.error("File write error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save file",
          error: error.message,
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Update user's profile picture URL
    const profilePictureUrl = `/uploads/${fileName}`;
    user.profilePictureUrl = profilePictureUrl;
    await user.save();
    console.log(
      "User profile updated with new picture URL:",
      profilePictureUrl
    );

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Profile picture uploaded successfully",
        data: {
          profilePictureUrl,
        },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error: any) {
    // Handle errors
    console.error("Profile picture upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload profile picture",
        error: error.message,
      } as ApiResponse,
      { status: 500 }
    );
  }
}
