import React from "react";
import { Link } from "react-router-dom";

const PharmacyConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen py-24 flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Registration Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Thank you for registering your pharmacy with us.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We will review the details and notify you of any updates.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <Link
            to="/"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Go to Home
          </Link>
          <button
            onClick={() => (window.location.href = "/register")}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Register Another Pharmacy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyConfirmation;
