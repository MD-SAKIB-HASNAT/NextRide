import React from "react";
import HashLoader from "react-spinners/HashLoader";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-slate-100">
      <div className="flex flex-col items-center justify-center gap-4">
        <HashLoader
          color="#001693"
          cssOverride={{}}
          loading={true}
          size={50}
          speedMultiplier={1}
        />
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}