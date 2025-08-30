import React from "react";

const Fail = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <svg
          className="w-16 h-16 mx-auto text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h1 className="text-2xl font-bold mt-4 text-red-600">Payment Failed</h1>
        <p className="text-gray-600 mt-2">
          Oops! Something went wrong with your payment. Please try again or
          contact support.
        </p>
      </div>
    </div>
  );
};

export default Fail;
