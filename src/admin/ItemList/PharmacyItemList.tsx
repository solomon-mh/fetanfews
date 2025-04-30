import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import React from "react";
import { usePharmacyData } from "../../contexts/PharmacyContext";
import { motion } from "framer-motion";
import { cardVariants } from "../../utils/animateVariant";
import { useNavigate } from "react-router-dom";

interface ItemListsProps {
	type: string;
	setSelectedStatus: (status: string) => void;
}

const PharmaItemLists: React.FC<ItemListsProps> = ({
	type,
	setSelectedStatus,
}) => {
	const navigate = useNavigate();

	const {
		numberOfPharmacies,
		pendingPharmacies,
		rejectedPharmacies,
		approvedPharmacies,
		loading,
	} = usePharmacyData();

	let data: {
		title: string;
		count: number;
		icon: JSX.Element | null;
		link: string;
		status: string;
	};

	// Dynamically change the UI content
	switch (type) {
		case "totalPharmacies":
			data = {
				title: "TOTAL PHARMACIES",
				count: numberOfPharmacies,
				status: "all",
				icon: (
					<PermIdentityIcon
						style={{
							color: "#4E9F3D",
							backgroundColor: "#E9F5DB",
						}}
						className="icon"
					/>
				),
				link: "See all Pharmacies",
			};
			break;
		case "approvedPharmacies":
			data = {
				title: "APPROVED PHARMACIES",
				count: approvedPharmacies,
				status: "Approved",

				icon: (
					<HowToRegOutlinedIcon
						style={{
							color: "#1E5128",
							backgroundColor: "#D8E9A8",
						}}
						className="icon"
					/>
				),
				link: "View approved Pharmacies",
			};
			break;
		case "pendingPharmacies":
			data = {
				title: "PENDING PHARMACIES",
				count: pendingPharmacies,
				status: "Pending",

				icon: (
					<PendingActionsOutlinedIcon
						style={{
							color: "#FCA652",
							backgroundColor: "#FFF5E4",
						}}
						className="icon"
					/>
				),
				link: "View pending Pharmacies",
			};
			break;
		case "rejectedPharmacies":
			data = {
				title: "REJECTED PHARMACIES",
				count: rejectedPharmacies,
				status: "Rejected",

				icon: (
					<HighlightOffOutlinedIcon
						style={{
							color: "#B91646",
							backgroundColor: "#FFEBEB",
						}}
						className="icon"
					/>
				),
				link: "View rejected Pharmacies",
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

	if (loading) {
		return (
			<p>
				<strong>Loading...</strong>
			</p>
		);
	}
	const handleClick = (status: string) => {
		setSelectedStatus(status);
		navigate(`/admin/pharmacies?status=${status.toLowerCase()}`);
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
					{((data.count / numberOfPharmacies) * 100).toFixed(2)} %
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

export default PharmaItemLists;
