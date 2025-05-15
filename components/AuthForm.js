// File: components/AuthForm.js
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AuthForm({ type, updateUser }) {
  const router = useRouter();
  const isRegister = type === "register";

  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    username: "",
    profilePicture: "",
    password: "",
    confirmPassword: "",
  });

  // State for form errors
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate form fields
    if (isRegister) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.age ||
        !formData.username
      ) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }
    }

    try {
      // Make API request
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Update user state
      updateUser(data.user);

      // Redirect to home page
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isRegister ? "Create an Account" : "Login to Your Account"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Profile Picture URL (optional)
              </label>
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {isRegister && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center">
        {isRegister ? (
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Login here
            </Link>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
// This code defines an authentication form component for a Next.js application. It handles both login and registration forms, including input validation and error handling. The form updates the user state upon successful submission and provides links for switching between login and registration pages.
