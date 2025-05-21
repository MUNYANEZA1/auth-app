"use client";

// Login form component
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useUser from "@/lib/hooks/useUser";
import { LoginFormInputs } from "@/lib/types";

// Login form component for user authentication
export default function LoginForm() {
  // Get router for navigation
  const router = useRouter();

  // Get user authentication functions from custom hook
  const { login, loading, error } = useUser();

  // Form state
  const [formData, setFormData] = useState<LoginFormInputs>({
    email: "",
    password: "",
  });

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<
    Partial<LoginFormInputs>
  >({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name as keyof LoginFormInputs]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Partial<LoginFormInputs> = {};

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
    }

    // Update validation errors
    setValidationErrors(errors);

    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    // Attempt login
    const success = await login(formData.email, formData.password);

    // Redirect to welcome page on success
    if (success) {
      router.push("/main/welcome");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {/* Display error message if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Email input */}
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={validationErrors.email}
          required
        />

        {/* Password input */}
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={validationErrors.password}
          required
        />

        {/* Submit button */}
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            disabled={loading}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
