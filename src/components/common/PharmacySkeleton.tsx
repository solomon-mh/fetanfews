import { FaMapMarkedAlt, FaClinicMedical } from "react-icons/fa";
import { motion } from "framer-motion";

const PharmacySkeleton = () => {
	return (
		<div className="p-6 space-y-6 animate-pulse">
			{/* Header Icons */}
			<div className="flex justify-center space-x-6 text-4xl text-slate-400">
				<motion.div
					initial={{ opacity: 0.2 }}
					animate={{ opacity: [0.2, 1, 0.2] }}
					transition={{ duration: 1.5, repeat: Infinity }}
				>
					<FaMapMarkedAlt />
				</motion.div>
			</div>

			{/* Skeleton cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className="flex items-center space-x-4 p-4 border border-slate-200 rounded-xl bg-white shadow-sm"
					>
						<div className="text-3xl text-slate-300 animate-pulse">
							<FaClinicMedical />
						</div>
						<div className="flex-1 space-y-2">
							<div className="h-4 bg-slate-200 rounded w-3/4"></div>
							<div className="h-3 bg-slate-100 rounded w-1/2"></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default PharmacySkeleton;
