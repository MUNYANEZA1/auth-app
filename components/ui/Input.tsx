// Input component for reuse across the application
import React, { forwardRef } from "react";

// Define the props for the Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
}

// Input component with label and error handling
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = "", ...props }, ref) => {
    // Base styles for all inputs
    const baseStyles =
      "rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

    // Error styles
    const errorStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-blue-500";

    // Width styles
    const widthStyles = fullWidth ? "w-full" : "";

    // Combine all styles
    const inputStyles = `${baseStyles} ${errorStyles} ${widthStyles} ${className}`;

    return (
      <div className={`mb-4 ${fullWidth ? "w-full" : ""}`}>
        {/* Render label if provided */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        {/* Input element */}
        <input ref={ref} className={inputStyles} {...props} />

        {/* Render error message if provided */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

// Set display name for debugging
Input.displayName = "Input";

export default Input;
