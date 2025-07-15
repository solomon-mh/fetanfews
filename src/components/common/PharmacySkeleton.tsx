import { FaMapMarkedAlt, FaClinicMedical } from "react-icons/fa";
import { motion } from "framer-motion";

const PharmacySkeleton = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse dark:bg-gray-800">
      {/* Header Icon with floating animation */}
      <div className="flex justify-center text-5xl text-slate-400 dark:text-slate-600">
        <motion.div
          initial={{ opacity: 0.2, y: 0 }}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaMapMarkedAlt />
        </motion.div>
      </div>

      {/* Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-4 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="text-3xl text-slate-300 dark:text-slate-600">
              <FaClinicMedical />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PharmacySkeleton;
