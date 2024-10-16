import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'default';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

interface TypeStyles {
  [key: string]: string;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyle = "fixed bottom-4 right-4 p-4 rounded-md shadow-lg flex items-center justify-between transition-opacity duration-300";
  const typeStyles: TypeStyles = {
    success: "bg-[#7d7cc7] text-white",
    error: "bg-[#eb8c87] text-white",
    info: "bg-[#a09edd] text-white",
    default: "bg-[#a09edd] text-white",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type] || typeStyles.default} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <span>{message}</span>
      <button onClick={() => { setIsVisible(false); onClose(); }} className="ml-4 focus:outline-none text-white hover:text-gray-200">
        <X size={20} />
      </button>
    </div>
  );
};