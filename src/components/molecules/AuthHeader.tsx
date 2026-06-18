import React from "react";

interface AuthHeaderProps {
  title: string;
  description: string;
  iconColor?: string;
  children?: React.ReactNode;
}

/**
 * Molecule: Auth Header Component
 * Header section for auth pages (login/register)
 */
export default function AuthHeader({
  title,
  description,
  iconColor = "bg-[#354e32]",
  children,
}: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      {children && (
        <div
          className={`w-20 h-20 ${iconColor} rounded-2xl flex items-center justify-center text-white mb-4`}
        >
          {children}
        </div>
      )}
      <h1 className="text-4xl font-bold text-[#354e32]">{title}</h1>
      <p className="text-gray-500 mt-2 text-center">{description}</p>
    </div>
  );
}
