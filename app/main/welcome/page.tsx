"use client";

// Welcome page component
import React from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import useUser from "@/lib/hooks/useUser";
import Button from "@/components/ui/Button";
import Link from "next/link";

// Welcome page component that displays user information
export default function WelcomePage() {
  // Get user data from custom hook
  const { user, loading, logout } = useUser();

  // If user is not authenticated, redirect to login page
  if (!user && !loading) {
    redirect("/auth/login");
  }

  // Handle logout
  const handleLogout = async () => {
    await logout();
    // Redirect happens automatically via the useUser hook
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          // Loading state
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : user ? (
          // User information display
          <div className="p-8">
            <div className="flex flex-col items-center mb-6">
              {/* Profile picture */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                <Image
                  src={user.profilePictureUrl}
                  alt={`${user.username}'s profile`}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>

              {/* Welcome message with username */}
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                Welcome, {user.username}!
              </h1>
            </div>

            {/* User details */}
            <div className="space-y-4 mb-8">
              <div className="border-t border-b border-gray-200 py-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Your Information
                </h2>
                <p className="text-gray-700">
                  <span className="font-medium">Full Name:</span>{" "}
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Age:</span> {user.age}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col space-y-3">
              <Link href="/main/profile" className="w-full">
                <Button variant="outline" fullWidth>
                  Update Profile
                </Button>
              </Link>
              <Button variant="primary" onClick={handleLogout} fullWidth>
                Logout
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
