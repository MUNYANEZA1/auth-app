"use client";

// Profile page component
import React from "react";
import { redirect } from "next/navigation";
import useUser from "@/lib/hooks/useUser";
import UpdateProfileForm from "@/components/profile/UpdateProfileForm";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";
import ProfileUploader from "@/components/ui/ProfileUploader";
import Button from "@/components/ui/Button";
import Link from "next/link";

// Profile page component for managing user profile
export default function ProfilePage() {
  // Get user data and functions from custom hook
  const { user, loading, uploadProfilePicture } = useUser();

  // If user is not authenticated, redirect to login page
  if (!user && !loading) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Manage Your Profile
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link
              href="/main/welcome"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Welcome Page
            </Link>
          </p>
        </div>

        {loading ? (
          // Loading state
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : user ? (
          <div className="space-y-8">
            {/* Profile picture section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Profile Picture
              </h2>
              <ProfileUploader
                currentImageUrl={user.profilePictureUrl}
                onUpload={uploadProfilePicture}
                className="mx-auto"
              />
            </div>

            {/* Update profile form */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Update Information
              </h2>
              <UpdateProfileForm />
            </div>

            {/* Delete account section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Danger Zone
              </h2>
              <p className="text-gray-700 mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <div className="flex justify-center">
                <DeleteAccountButton />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
// This code defines a ProfilePage component that allows users to manage their profile information, including updating their profile picture and personal details, as well as deleting their account. The component uses a custom hook to fetch user data and handle profile picture uploads. If the user is not authenticated, they are redirected to the login page.
// The component is styled using Tailwind CSS classes for a clean and modern look. It includes loading states and error handling to ensure a smooth user experience.