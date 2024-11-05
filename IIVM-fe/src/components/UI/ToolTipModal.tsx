import React from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/misx";

interface ToolTipModalProps {
  showModal: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: { top: number; left: number };
  className?: string;
}

export const ToolTipModal: React.FC<ToolTipModalProps> = ({
  showModal,
  onClose,
  children,
  position,
  className,
}) => {
  if (!showModal) return null;

  return (
    <div
      className={cn(
        "absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-[12px]",
        "w-64 relative",
        className
      )}
      style={{
        top: position?.top,
        left: position?.left,
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X size={16} />
      </button>
      <div className="text-sm space-y-2 mt-4">{children}</div>
    </div>
  );
};