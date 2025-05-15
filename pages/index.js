// File: pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Home({ user, loading }) {
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">
          Welcome, {user.username}!
        </h1>
        <p className="text-gray-600">We're glad to see you here.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={user.profilePicture || "/default-avatar.png"}
            alt={`${user.firstName} ${user.lastName}`}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Your Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Full Name:</p>
                <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
              </div>
              <div>
                <p className="text-gray-600">Age:</p>
                <p className="font-medium">{user.age}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Username:</p>
                <p className="font-medium">{user.username}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/profile")}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
