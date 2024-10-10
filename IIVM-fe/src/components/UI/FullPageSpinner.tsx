import React from "react";

const FullPageSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="flex flex-col items-center bg-[#5e67aa] hover:bg-[#7a7fa0] focus:outline-none focus:ring-2 focus:ring-[#8a8fb6] focus:ring-opacity-50 p-4 rounded-lg">
        <div className="w-16 h-16 border-4 border-[#ffffff] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-semibold text-[#ffffff]">Loading...</p>
      </div>
    </div>
  );
};

export default FullPageSpinner;