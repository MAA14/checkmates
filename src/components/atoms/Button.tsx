import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Atom: Button Component
 * Reusable button with multiple variants and sizes
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary: "bg-[#354e32] hover:bg-[#283b25] text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      danger: "bg-red-500 hover:bg-red-600 text-white",
    };

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "w-full px-4 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
