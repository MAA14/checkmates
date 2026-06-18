import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Atom: Input Component
 * Base input field with optional label and error message
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block mb-2 font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full border rounded-xl p-4 outline-none transition ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/40 focus:border-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-[#354e32]/40 focus:border-[#354e32]"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
