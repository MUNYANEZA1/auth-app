"use client";

// Profile picture uploader component
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Button from "./Button";

// Define the props for the ProfileUploader component
interface ProfileUploaderProps {
  currentImageUrl: string;
  onUpload: (file: File) => Promise<boolean>;
  className?: string;
}

// Component for handling profile picture uploads
export default function ProfileUploader({
  currentImageUrl,
  onUpload,
  className = "",
}: ProfileUploaderProps) {
  // State for tracking loading state during upload
  const [isLoading, setIsLoading] = useState(false);
  // State for tracking error messages
  const [error, setError] = useState<string | null>(null);
  // State for preview image before upload
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // State for tracking the final display image
  const [displayImageUrl, setDisplayImageUrl] = useState(currentImageUrl);

  // Reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update display image when currentImageUrl changes
  useEffect(() => {
    setDisplayImageUrl(currentImageUrl);
  }, [currentImageUrl]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      // Revoke object URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle click on the upload button
  const handleUploadClick = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Reset error state
    setError(null);

    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setDisplayImageUrl(objectUrl);

    // Upload the file
    handleUploadFile(file);

    // Reset the file input
    if (event.target) {
      event.target.value = "";
    }
  };

  // Handle file upload
  const handleUploadFile = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Uploading file:", file.name, file.type, file.size);

      // Call the onUpload function passed as prop
      const success = await onUpload(file);

      if (!success) {
        console.error("Upload failed via onUpload callback");
        setError("Failed to upload profile picture. Please try again.");
        // Revert preview if upload fails
        setDisplayImageUrl(currentImageUrl);
        setPreviewUrl(null);
      } else {
        console.log("Upload successful");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "An error occurred during upload");
      // Revert preview if upload fails
      setDisplayImageUrl(currentImageUrl);
      setPreviewUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a default image fallback
  const handleImageError = () => {
    console.log("Image failed to load, using default avatar");
    setDisplayImageUrl("/default-avatar.png");
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Profile image */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-gray-200">
        <Image
          src={displayImageUrl}
          alt="Profile"
          fill
          sizes="128px" // Add sizes prop to fix Next.js warning
          style={{ objectFit: "cover" }}
          priority
          onError={handleImageError}
        />
      </div>

      {/* Upload button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleUploadClick}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "Change Profile Picture"}
      </Button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      {/* Error message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
