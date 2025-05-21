"use client";

// Delete account button component
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import useUser from "@/lib/hooks/useUser";

// Delete account button component with confirmation modal
export default function DeleteAccountButton() {
  // Get router for navigation
  const router = useRouter();

  // Get delete account function from custom hook
  const { deleteAccount, loading } = useUser();

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for error message
  const [error, setError] = useState<string | null>(null);

  // Open confirmation modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null);
  };

  // Close confirmation modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      // Attempt to delete account
      const success = await deleteAccount();

      // Redirect to home page on success
      if (success) {
        router.push("/");
      } else {
        setError("Failed to delete account. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while deleting your account");
    }
  };

  // Modal footer with cancel and confirm buttons
  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
        Cancel
      </Button>
      <Button
        variant="danger"
        onClick={handleDeleteAccount}
        isLoading={loading}
        disabled={loading}
      >
        Delete Account
      </Button>
    </div>
  );

  return (
    <>
      {/* Delete account button */}
      <Button variant="danger" onClick={handleOpenModal} className="mt-6">
        Delete Account
      </Button>

      {/* Confirmation modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Delete Account"
        footer={modalFooter}
      >
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <p className="text-gray-700 mb-4">
            All your data will be permanently removed from our servers.
          </p>

          {/* Display error message if any */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
