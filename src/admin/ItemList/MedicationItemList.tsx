import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cardVariants } from "../../utils/animateVariant";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { fetchMedicationCounts } from "../../api/medicationService";
import { FaBan, FaList } from "react-icons/fa";
import { MdWarning, MdInventory } from "react-icons/md";
interface ItemListsProps {
	type: string;
	setSelectedStatus: (status: string) => void;
}
const MedItemLists: React.FC<ItemListsProps> = ({
	type,
	setSelectedStatus,
}) => {
	const navigate = useNavigate();
	const [medCounts, setMedCounts] = useState({
		total: 0,
		inStock: 0,
		outOfStock: 0,
		expired: 0,
	});
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchMedicationCounts();
				setMedCounts(data);
			} catch (error) {
				console.error("Error fetching medication data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<p>
				<strong>Loading...</strong>
			</p>
		);
	}

	let data;
	switch (type) {
		case "totalMedications":
			data = {
				title: "TOTAL MEDICATIONS",
				count: medCounts.total,
				status: "all",
				icon: (
					<FaList
						style={{ color: "#4E9F3D", backgroundColor: "#E9F5DB" }}
						className="icon"
					/>
				),
				link: "See all Medications",
			};
			break;
		case "inStokMedications":
			data = {
				title: "IN-STOCK MEDICATIONS",
				count: medCounts.inStock,
				status: "inStock",
				icon: (
					<MdInventory
						style={{ color: "#1E5128", backgroundColor: "#D8E9A8" }}
						className="icon"
					/>
				),
				link: "View In-Stock Medications",
			};
			break;
		case "outOfStokMedications":
			data = {
				title: "OUT-OF-STOCK MEDICATIONS",
				count: medCounts.outOfStock,
				status: "outOfStock",
				icon: (
					<FaBan
						style={{ color: "#FCA652", backgroundColor: "#FFF5E4" }}
						className="icon"
					/>
				),
				link: "View Out-of-Stock Medications",
			};
			break;
		case "expiredMedications":
			data = {
				title: "EXPIRED MEDICATIONS",
				count: medCounts.expired,
				status: "expired",
				icon: (
					<MdWarning
						style={{ color: "#B91646", backgroundColor: "#FFEBEB" }}
						className="icon"
					/>
				),
				link: "View Expired Medications",
			};
			break;
		default:
			data = {
				title: "UNKNOWN TYPE",
				count: 0,
				status: "",
				icon: null,
				link: "No link available",
			};
			break;
	}

	const handleClick = (status: string) => {
		setSelectedStatus(status);
		navigate(`/admin/pharmacy/medications?med-status=${status.toLowerCase()}`);
	};

	return (
		<motion.div
			className="item_listss"
			variants={cardVariants}
			initial="hidden"
			animate="visible"
			whileHover="hover"
			transition={{ duration: 0.5 }}
		>
			<div className="name">
				<p>{data.title}</p>
				<span className="percentage positive">
					<KeyboardArrowUpIcon />
					{medCounts.total > 0
						? ((data.count / medCounts.total) * 100).toFixed(2)
						: 0}{" "}
					%
				</span>
			</div>
			<div className="counts">{data.count}</div>
			<div className="see_item">
				<button
					style={{ border: "none" }}
					onClick={() => handleClick(data.status)}
				>
					<p>{data.link}</p>
				</button>
				{data.icon}
			</div>
		</motion.div>
	);
};

export default MedItemLists;
