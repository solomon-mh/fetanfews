import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};

	// Animation variants
	const fadeInUp = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
			<motion.h1
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 0, scale: 0.8 },
					visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
				}}
				className="text-7xl font-extrabold text-green-600 dark:text-lime-400"
			>
				404
			</motion.h1>

			<motion.p
				initial="hidden"
				animate="visible"
				variants={fadeInUp}
				className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-4"
			>
				Oops! The page you're looking for doesn't exist.
			</motion.p>

			<motion.button
				onClick={handleGoBack}
				initial="hidden"
				animate="visible"
				className="mt-6 px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 dark:bg-lime-500 dark:hover:bg-lime-600 transition shadow-md"
			>
				← Go Back
			</motion.button>
		</div>
	);
};

export default NotFound;
