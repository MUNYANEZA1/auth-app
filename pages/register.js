// File: pages/register.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthForm from "../components/AuthForm";

export default function Register({ user, loading, updateUser }) {
  const router = useRouter();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is authenticated, don't show the register form
  if (user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
      <AuthForm type="register" updateUser={updateUser} />
    </div>
  );
}
