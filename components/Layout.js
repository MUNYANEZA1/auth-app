// File: components/Layout.js
import React from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on component mount
  useEffect(() => {
    // Fetch user profile
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Function to update user state after login/register
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user state after logout
  const clearUser = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Auth App</title>
        <meta
          name="description"
          content="Authentication application with Next.js and MongoDB"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar user={user} clearUser={clearUser} />

      <main className="container mx-auto px-4 py-8">
        {React.cloneElement(children, { user, loading, updateUser })}
      </main>
    </div>
  );
}
// This code defines a Layout component for a Next.js application. It includes a Navbar and manages user authentication state. The component fetches the user's profile on mount and provides functions to update or clear the user state. The main content is passed as children, allowing for dynamic rendering based on the user's authentication status.
// The Layout component uses the useEffect hook to fetch user data from an API endpoint and sets the loading state accordingly. It also uses the useRouter hook from Next.js for navigation. The updateUser and clearUser functions are passed down to child components for managing user state.