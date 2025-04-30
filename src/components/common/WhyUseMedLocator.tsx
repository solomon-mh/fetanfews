import React, { useRef } from "react";
import { FaMapMarkerAlt, FaClock, FaMedkit, FaSearch } from "react-icons/fa";
import { cardVariants } from "../../utils/animateVariant";
import { motion, useInView } from "framer-motion";
const WhyUseMedLocator: React.FC = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		once: true, // Trigger only once
	});
	const benefits = [
		{
			icon: <FaMapMarkerAlt />,
			title: "Locate Nearby Pharmacies",
			description:
				"Find pharmacies near you quickly with accurate location details.",
		},
		{
			icon: <FaClock />,
			title: "Save Time",
			description:
				"Get instant access to pharmacy information and available medicines.",
		},
		{
			icon: <FaMedkit />,
			title: "Comprehensive Drug Data",
			description:
				"Access a wide range of medications, categorized for your convenience.",
		},
		{
			icon: <FaSearch />,
			title: "Effortless Search",
			description:
				"Easily search by medication category or pharmacy name with advanced filters.",
		},
	];

	return (
		<section className="why-use-medlocator">
			<h2 className="section-title">Why Use FetanFews?</h2>
			<div className="benefits-grid">
				{benefits.map((benefit, index) => (
					<motion.div
						key={index}
						ref={ref}
						className="benefit-item"
						variants={cardVariants}
						initial="hidden"
						animate={isInView ? "visible" : "hidden"}
						whileHover="hover"
						transition={{ duration: 0.5 }}
					>
						<div className="icon-container">{benefit.icon}</div>
						<h3 className="benefit-title">{benefit.title}</h3>
						<p className="benefit-description">{benefit.description}</p>
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default WhyUseMedLocator;
