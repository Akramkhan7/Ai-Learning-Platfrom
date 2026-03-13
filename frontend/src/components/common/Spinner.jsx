import React from "react";

const Spinner = () => {
  return (
    <div className="min-h-screen mt-30">
      <div className="relative flex items-center justify-center">

        {/* outer faded ring */}
        <div className="w-6 h-6 rounded-full border-4 border-emerald-200"></div>

        {/* spinning gradient ring */}
        <div className="absolute w-6 h-6 rounded-full border-4 border-transparent border-t-emerald-500 border-r-teal-500 animate-spin"></div>


      </div>
    </div>
  );
};

export default Spinner;