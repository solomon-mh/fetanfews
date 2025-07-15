import { useEffect, useState } from "react";

export const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    // Typing dots animation
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-xl bg-opacity-90 dark:bg-opacity-90">
        {/* Multi-orbital animation */}
        <div className="relative w-24 h-24">
          {/* Central orb */}
          <div
            className="absolute bg-blue-500 shadow-glow-blue dark:bg-emerald-400 dark:shadow-glow-emerald top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 rounded-full 
            animate-pulse-slow"
          ></div>

          {/* Orbiting orbs */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`absolute bg-purple-400 shadow-glow-purple dark:bg-indigo-500 dark:shadow-glow-indigo top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full 
                animate-orbital-${i}`}
              style={{
                transform: `rotate(${i * 120}deg) translateX(28px) rotate(-${
                  i * 120
                }deg)`,
              }}
            ></div>
          ))}

          {/* Outer ring */}
          <div className="absolute border-emerald-300 dark:border-blue-400 inset-0 rounded-full border-2 border-opacity-20"></div>
        </div>

        {/* Loading text with typing animation */}
        <div className="flex items-center">
          <span className="text-xl font-medium  dark:text-white">Loading</span>
          <span className="text-xl font-medium w-6 dark:text-white">
            {dots}
          </span>
        </div>

        {/* Gradient progress bar */}
        <div className="w-48 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full 
  bg-gradient-to-r from-blue-500 to-indigo-600 
  dark:from-emerald-400 dark:to-purple-500"
            style={{ width: `${progress}%`, transition: "width 0.1s ease-out" }}
          ></div>
        </div>

        {/* Percentage counter */}
        <div className="text-sm font-mono dark:text-white">{progress}%</div>
      </div>
    </div>
  );
};
