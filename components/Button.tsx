// components/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asLink?: boolean;
  href?: string;
  download?: boolean;
  variant?: "primary" | "secondary";
}

const Button = ({
  children,
  asLink = false,
  href,
  download = false,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition";

  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  const finalClasses = `${baseClasses} ${variantClasses}`;

  if (asLink && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={finalClasses}
        {...(download ? { download: true } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button {...props} className={finalClasses}>
      {children}
    </button>
  );
};

export default Button;