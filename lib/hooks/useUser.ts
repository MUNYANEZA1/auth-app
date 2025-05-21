"use client"

// Custom hook for user authentication
import { useState, useEffect } from "react";
import { User } from "@/lib/types";

// Define the return type for the useUser hook
interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: FormData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  uploadProfilePicture: (file: File) => Promise<boolean>;
}

// Custom hook for user authentication and management
export default function useUser(): UseUserReturn {
  // State for user data, loading status, and error messages
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/me");
        const data = await response.json();

        if (data.success) {
          setUser(data.data);
        } else {
          // If not authenticated, clear user data
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Function to handle user login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        return true;
      } else {
        setError(data.message || "Login failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user registration
  const register = async (userData: FormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // If there's a profile picture, handle it separately
      const profilePicture = userData.get("profilePicture") as File;
      userData.delete("profilePicture");

      // Convert FormData to JSON for the registration API
      const formDataObj: any = {};
      userData.forEach((value, key) => {
        formDataObj[key] = value;
      });

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      });

      const data = await response.json();

      if (data.success) {
        // If registration is successful, log the user in
        const loginSuccess = await login(
          formDataObj.email,
          formDataObj.password
        );

        // If login is successful and there's a profile picture, upload it
        if (loginSuccess && profilePicture && profilePicture.size > 0) {
          await uploadProfilePicture(profilePicture);
        }

        return loginSuccess;
      } else {
        setError(data.message || "Registration failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout
  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
        return true;
      } else {
        setError(data.message || "Logout failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during logout");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to update user data
  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        return true;
      } else {
        setError(data.message || "Update failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during update");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete user account
  const deleteAccount = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user/me", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
        return true;
      } else {
        setError(data.message || "Account deletion failed");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during account deletion");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to upload profile picture
  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/profile-picture", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Update user state with new profile picture URL
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            profilePictureUrl: data.data.profilePictureUrl,
          };
        });
        return true;
      } else {
        setError(data.message || "Profile picture upload failed");
        return false;
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred during profile picture upload"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Return the hook's state and functions
  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    deleteAccount,
    uploadProfilePicture,
  };
}
