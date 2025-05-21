"use client";

// Layout component for the main section
import React from "react";

// Define the props for the layout component
interface LayoutProps {
  children: React.ReactNode;
}

// Layout component that wraps all authenticated pages
export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* The children prop represents the page content */}
      {children}
    </div>
  );
}
