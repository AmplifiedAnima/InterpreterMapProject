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
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  className = "",
  type = "button",
  children,
  imageIcon,
  disabled,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={cn(
        "font-semibold text-white h-10 px-[10.5px] rounded transition duration-200",
        "bg-[#5e67aa] hover:bg-[#7a7fa0] focus:outline-none focus:ring-2 focus:ring-[#8a8fb6] focus:ring-opacity-50",
        className
      )}
      onClick={onClick}
      {...rest}
      disabled={disabled}
    >
      {children ||
        label ||
        (imageIcon && <img src={imageIcon} width={16} alt="icon" />)}
    </button>
  );
};
