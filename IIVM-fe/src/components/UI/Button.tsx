import React from "react";
import { cn } from "../../utils/misx";

interface ButtonProps {
  label?: string | React.ReactNode;
  className?: string;
  imageIcon?: string;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  className = "",
  type = "button",
  children,
  imageIcon,
  disabled,
  variant = "primary",
  ...rest
}) => {
  const baseStyles = "font-semibold text-sm py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
  const variantStyles = {
    primary: "bg-[#7d7cc7] hover:bg-[#6c6bb6] text-white focus:ring-[#a09edd]",
    secondary: "bg-[#f0f0f7] hover:bg-[#e0e0f0] text-[#7d7cc7] focus:ring-[#a09edd]",
    outline: "bg-transparent border border-[#7d7cc7] text-[#7d7cc7] hover:bg-[#f0f0f7] focus:ring-[#a09edd]"
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      <div className="flex items-center justify-center">
        {imageIcon && <img src={imageIcon} width={16} alt="icon" className="mr-2" />}
        {children || label}
      </div>
    </button>
  );
};