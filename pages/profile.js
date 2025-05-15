// File: pages/profile.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import ProfileCard from "../components/ProfileCard";

export default function Profile({ user, loading, updateUser }) {
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading indicator while checking authentication
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Your Profile</h1>
      <ProfileCard user={user} updateUser={updateUser} />
    </div>
  );
}
// This code defines a Profile component for a Next.js application. It checks if the user is authenticated and redirects to the login page if not. If the user is authenticated, it displays the user's profile information using the ProfileCard component. The component also shows a loading indicator while checking authentication status.
// The useEffect hook is used to handle the redirection logic, and the component uses the useRouter hook from Next.js for navigation. The ProfileCard component is passed the user object and an updateUser function to handle any updates to the user's profile information.
