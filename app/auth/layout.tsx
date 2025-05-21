"use client";

// Layout component for the auth section
import React from "react";

// Define the props for the layout component
interface LayoutProps {
  children: React.ReactNode;
}

// Layout component that wraps all authentication pages
export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* The children prop represents the page content */}
      {children}
    </div>
  );
}
