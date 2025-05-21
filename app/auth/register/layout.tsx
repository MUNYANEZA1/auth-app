"use client";

// Layout component for the register page
import React from "react";

// Define the props for the layout component
interface LayoutProps {
  children: React.ReactNode;
}

// Layout component that wraps the register page
export default function RegisterLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* The children prop represents the page content */}
      {children}
    </div>
  );
}
