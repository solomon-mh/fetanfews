import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "Before this platform, tracking inventory was a nightmare. Now, we save time and money every month.",
    name: "Mulu Pharmacy",
    location: "Addis Ababa",
  },
  {
    quote:
      "Sales analytics helped us identify our top-selling products. We adjusted stock and saw a 25% profit boost.",
    name: "Beteseb Pharmacy",
    location: "Bahir Dar",
  },
  {
    quote:
      "The expiry alert system saved us from wasting thousands worth of medicines.",
    name: "Hibret Pharmacy",
    location: "Gondar",
  },
  {
    quote:
      "This platform connected our branches and streamlined transfers. A must-have for modern pharmacies.",
    name: "Addis HealthMart",
    location: "Hawassa",
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

export default function TestimonialsSection() {
  const [[index, direction], setIndex] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setIndex([
      (index + newDirection + testimonials.length) % testimonials.length,
      newDirection,
    ]);
  };

  return (
    <section className="relative max-w-4xl mx-auto px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>

      <div className="relative z-10">
        <h2 className="text-4xl font-bold mb-2 text-indigo-900 dark:text-indigo-200">
          What Our Partners Say
        </h2>
        <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-12">
          Trusted by pharmacies across Ethiopia
        </p>

        <div className="relative h-64 md:h-56 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute top-0 left-0 right-0 px-8"
            >
              <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md max-w-3xl mx-auto">
                <blockquote className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed">
                  "{testimonials[index].quote}"
                </blockquote>
                <div className="mt-6">
                  <p className="font-semibold text-indigo-600 dark:text-indigo-300">
                    {testimonials[index].name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonials[index].location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => paginate(-1)}
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex([i, i > index ? 1 : -1])}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === index
                    ? "bg-indigo-600 dark:bg-indigo-400"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
