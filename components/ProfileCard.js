// File: components/ProfileCard.js
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function ProfileCard({ user, updateUser }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    username: user?.username || "",
    profilePicture: user?.profilePicture || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update user state with new data
      updateUser(data.user);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete account");
      }

      // Redirect to login page after account deletion
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        username: user.username,
        profilePicture: user.profilePicture,
      });
    }
    setIsEditing(!isEditing);
    setError("");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleUpdate}>
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

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Profile Picture URL
            </label>
            <input
              type="text"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
              onClick={toggleEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={user.profilePicture || "/default-avatar.png"}
                alt={`${user.firstName} ${user.lastName}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">First Name:</p>
                <p className="font-medium">{user.firstName}</p>
              </div>
              <div>
                <p className="text-gray-600">Last Name:</p>
                <p className="font-medium">{user.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600">Age:</p>
                <p className="font-medium">{user.age}</p>
              </div>
              <div>
                <p className="text-gray-600">Full Name:</p>
                <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
              onClick={toggleEdit}
            >
              Edit Profile
            </button>
            <button
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              onClick={handleDelete}
            >
              Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
}
