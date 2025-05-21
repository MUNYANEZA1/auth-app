// Logout API endpoint
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/lib/types";

// POST handler for user logout
export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
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
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
        error: error.message,
      } as ApiResponse,
      { status: 500 }
    );
  }
}
