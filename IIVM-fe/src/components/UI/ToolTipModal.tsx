import React from "react";
import { Button } from "./Button";
import closeIcon from "../../assets/icons/x.svg";
import { cn } from "../../utils/misx";

interface ToolTipModalProps {
  showModal: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: { top: number; left: number };
  title?: string;
  className?: string;
}

export const ToolTipModal: React.FC<ToolTipModalProps> = ({
  showModal,
  onClose,
  children,
  position,
  title,
  className,
}) => {
  if (!showModal) return null;

  return (
    <div
      className={cn(
        "absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4",
        "max-w-sm w-full",
        className
      )}
      style={{
        top: position?.top,
        left: position?.left,
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-[#5e67aa]">{title}</h2>
        <Button
          onClick={onClose}
          className="p-1 bg-transparent hover:bg-[#f0f4ff] text-[#5e67aa] rounded-full"
          imageIcon={closeIcon}
        />
      </div>
      <div
        className="overflow-y-auto max-h-[300px] pr-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#8b8ad6 #e5e7eb",
        }}
      >
        {children}
      </div>
    </div>
  );
};