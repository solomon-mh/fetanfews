import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PharmacyHelp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "Benefits of Registration",
      content: (
        <ul className="list-disc list-inside space-y-2 text-base">
          <li>Get discovered by nearby users.</li>
          <li>Enable delivery for wider access.</li>
          <li>Show real-time drug availability.</li>
          <li>Reduce phone inquiries with clear info.</li>
          <li>Access customer search analytics.</li>
        </ul>
      ),
    },
    {
      title: "Payment & Premium Features",
      content: (
        <ul className="list-disc list-inside space-y-2 text-base">
          <li>Basic registration is free.</li>
          <li>Optional premium for promotions and priority listing.</li>
          <li>Boost visibility with featured listings.</li>
          <li>Secure payment system for upgrades.</li>
          <li>Monthly analytics report included.</li>
        </ul>
      ),
    },
    {
      title: "How to Register",
      content: (
        <>
          <ol className="list-decimal list-inside space-y-2 text-base">
            <li>Fill out all required fields in the form.</li>
            <li>Optional: Upload a pharmacy image as a logo.</li>
            <li>
              Provide a detailed address within Bahir Dar (e.g., Kebele,
              building name).
            </li>
            <li>Click "Submit" to finish your registration.</li>
          </ol>
          <p className="mt-4 text-center">
            <Link
              to="/pharmacy-registration/form"
              className="text-green-600 dark:text-lime-400 underline font-medium hover:text-green-800 dark:hover:text-lime-300"
            >
              Go to Registration →
            </Link>
          </p>
        </>
      ),
    },
  ];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="px-6 pt-40 py-10 md:px-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-green-700 dark:text-lime-400">
        Pharmacy Registration Info
      </h2>

      {/* Arrows */}
      <div className="flex justify-center items-center mb-6 gap-4">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-green-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-gray-600 text-green-700 dark:text-lime-300 shadow-md disabled:opacity-40"
          disabled={currentIndex === 0}
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-green-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-gray-600 text-green-700 dark:text-lime-300 shadow-md disabled:opacity-40"
          disabled={currentIndex === slides.length - 1}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Slide container */}
      <div className="relative w-full max-w-xl mx-auto h-auto">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute transition-opacity duration-500 ease-in-out top-0 left-0 w-full ${
              index === currentIndex
                ? "opacity-100 relative"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-lime-400">
                {slide.title}
              </h3>
              {slide.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyHelp;
