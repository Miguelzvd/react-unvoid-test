import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const baseStyles =
  "px-6 py-2 rounded-lg font-semibold text-base transition-colors duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 border border-transparent",
  secondary:
    "bg-black text-white border border-gray-300 hover:bg-gray-900 hover:border-gray-400 active:bg-gray-800",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
