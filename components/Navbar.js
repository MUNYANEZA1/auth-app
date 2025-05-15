// File: components/Navbar.js
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar({ user, clearUser }) {
  const router = useRouter();

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Clear user state and redirect to login page
        clearUser();
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Auth App
        </Link>

        <div className="flex space-x-4">
          {user ? (
            <>
              <Link href="/profile" className="hover:text-indigo-200">
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:text-indigo-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-200">
                Login
              </Link>
              <Link href="/register" className="hover:text-indigo-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
