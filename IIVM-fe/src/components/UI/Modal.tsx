import React from "react";
import { Button } from "../UI/Button";
import { cn } from "../../utils/misx";

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  showModal,
  onClose,
  title,
  children,
  footer,
  className = "",
}) => {
  if (!showModal) return null;

  return (
    <div className={cn("fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50")}>
      <div className={`bg-white rounded-lg shadow-lg p-6 max-w-full w-[70vw] h-[80vh] flex flex-col ${className}`}>
        {/* Modal Title */}
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

        {/* Content - Make it scrollable if there's too much content */}
        <div className="flex-grow overflow-auto mb-4">
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          <div className="flex justify-end gap-4">{footer}</div>
        ) : (
          <div className="flex justify-end gap-4">
            <Button onClick={onClose} className="bg-gray-300 text-gray-800">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
