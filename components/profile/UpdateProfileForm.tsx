"use client";

// Update profile form component
import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useUser from "@/lib/hooks/useUser";
import { User, UpdateProfileValidationErrors } from "@/lib/types";

// Update profile form component for editing user information
export default function UpdateProfileForm() {
  // Get user data and update function from custom hook
  const { user, updateUser, loading, error } = useUser();

  // Form state initialized with current user data
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || 0,
    username: user?.username || "",
  });

  // Form validation errors - now using the specific validation error type
  const [validationErrors, setValidationErrors] =
    useState<UpdateProfileValidationErrors>({});

  // Success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    if (validationErrors[name as keyof UpdateProfileValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: UpdateProfileValidationErrors = {};

    // Validate first name
    if (formData.firstName !== undefined && !formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    // Validate last name
    if (formData.lastName !== undefined && !formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    // Validate age
    if (formData.age !== undefined && formData.age < 13) {
      errors.age = "You must be at least 13 years old";
    }

    // Validate username
    if (formData.username !== undefined) {
      if (!formData.username.trim()) {
        errors.username = "Username is required";
      } else if (formData.username.length < 3) {
        errors.username = "Username must be at least 3 characters";
      }
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

    // Only include fields that have changed
    const changedData: Partial<User> = {};
    if (formData.firstName !== user?.firstName)
      changedData.firstName = formData.firstName;
    if (formData.lastName !== user?.lastName)
      changedData.lastName = formData.lastName;
    if (formData.age !== user?.age) changedData.age = formData.age;
    if (formData.username !== user?.username)
      changedData.username = formData.username;

    // If no changes, show message and return
    if (Object.keys(changedData).length === 0) {
      setSuccessMessage("No changes to save");
      return;
    }

    // Attempt to update user profile
    const success = await updateUser(changedData);

    // Show success message
    if (success) {
      setSuccessMessage("Profile updated successfully");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Update Profile
        </h2>

        {/* Display error message if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Display success message if any */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

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

        {/* Submit button */}
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
