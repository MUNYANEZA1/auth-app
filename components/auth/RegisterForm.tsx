"use client";

// Registration form component
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProfileUploader from "@/components/ui/ProfileUploader";
import useUser from "@/lib/hooks/useUser";
import { RegisterFormInputs, FormValidationErrors } from "@/lib/types";

// Registration form component for new user sign-up
export default function RegisterForm() {
  // Get router for navigation
  const router = useRouter();

  // Get user registration function from custom hook
  const { register, loading, error } = useUser();

  // Form state
  const [formData, setFormData] = useState<RegisterFormInputs>({
    firstName: "",
    lastName: "",
    age: 0,
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // State for profile picture
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // Form validation errors - updated to use the new type
  const [validationErrors, setValidationErrors] =
    useState<FormValidationErrors>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Handle number inputs
    const processedValue = type === "number" ? parseInt(value) || 0 : value;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear validation error for this field
    if (validationErrors[name as keyof FormValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle profile picture selection
  const handleProfilePictureChange = (file: File) => {
    setProfilePicture(file);
    return Promise.resolve(true); // Mock success for preview
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: FormValidationErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    // Validate age
    if (!formData.age) {
      errors.age = "Age is required";
    } else if (formData.age < 13) {
      errors.age = "You must be at least 13 years old";
    }

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate username
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

    // Create FormData for submission
    const formDataObj = new FormData();
    formDataObj.append("firstName", formData.firstName);
    formDataObj.append("lastName", formData.lastName);
    formDataObj.append("age", formData.age.toString());
    formDataObj.append("email", formData.email);
    formDataObj.append("username", formData.username);
    formDataObj.append("password", formData.password);
    formDataObj.append("confirmPassword", formData.confirmPassword);

    // Add profile picture if selected
    if (profilePicture) {
      formDataObj.append("profilePicture", profilePicture);
    }

    // Attempt registration
    const success = await register(formDataObj);

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
          Register
        </h2>

        {/* Display error message if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Profile picture uploader */}
        <div className="mb-6 flex justify-center">
          <ProfileUploader
            currentImageUrl="/default-avatar.png"
            onUpload={handleProfilePictureChange}
          />
        </div>

        {/* First name input */}
        <Input
          label="First Name"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
          error={validationErrors.firstName}
          required
        />

        {/* Last name input */}
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
          error={validationErrors.lastName}
          required
        />

        {/* Age input */}
        <Input
          label="Age"
          type="number"
          name="age"
          value={formData.age || ""}
          onChange={handleChange}
          placeholder="Enter your age"
          error={validationErrors.age}
          min={13}
          required
        />

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

        {/* Username input */}
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          error={validationErrors.username}
          required
        />

        {/* Password input */}
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          error={validationErrors.password}
          required
        />

        {/* Confirm password input */}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={validationErrors.confirmPassword}
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
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
