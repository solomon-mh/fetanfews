import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import React from "react";
import { Link } from "react-router-dom";
import "./itemList.scss";
import { usePharmacyData } from "../../contexts/PharmacyContext";
import { motion } from "framer-motion";
import { cardVariants } from "../../utils/animateVariant";
interface ItemListsProps {
  type:
    | "totalPharmacies"
    | "approvedPharmacies"
    | "pendingPharmacies"
    | "rejectedPharmacies";
}

const ItemLists: React.FC<ItemListsProps> = ({ type }) => {
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
    linkto: string;
  };

  // Dynamically change the UI content
  switch (type) {
    case "totalPharmacies":
      data = {
        title: "TOTAL PHARMACIES",
        count: numberOfPharmacies,
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
        linkto: "/admin",
      };
      break;
    case "approvedPharmacies":
      data = {
        title: "APPROVED PHARMACIES",
        count: approvedPharmacies,
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
        linkto: "/admin/Pharmacies/approved",
      };
      break;
    case "pendingPharmacies":
      data = {
        title: "PENDING PHARMACIES",
        count: pendingPharmacies,
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
        linkto: "/admin/Pharmacies/pending",
      };
      break;
    case "rejectedPharmacies":
      data = {
        title: "REJECTED PHARMACIES",
        count: rejectedPharmacies,
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
        linkto: "/admin/Pharmacies/rejected",
      };
      break;
    default:
      data = {
        title: "UNKNOWN TYPE",
        count: 0,
        icon: null,
        link: "No link available",
        linkto: "/",
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
        <Link to={data.linkto}>
          <p>{data.link}</p>
        </Link>
        {data.icon}
      </div>
    </motion.div>
  );
};

export default ItemLists;
