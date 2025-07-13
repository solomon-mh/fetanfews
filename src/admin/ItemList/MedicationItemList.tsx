import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cardVariants } from "../../utils/animateVariant";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { fetchMedicationCounts } from "../../api/medicationService";
import { FaBan, FaList } from "react-icons/fa";
import { MdWarning, MdInventory } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import { getPharmacistsPharmacy } from "../../api/pharmacyService";
import { usePharmacyStore } from "../../store/usePharmacyStore";

interface ItemListsProps {
  type: string;
  setSelectedStatus: (status: string) => void;
}

const MedItemLists: React.FC<ItemListsProps> = ({
  type,
  setSelectedStatus,
}) => {
  const { user } = useAuth();
  const { pharmacyMed, setPharmacyMed } = usePharmacyStore();
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
      if (user?.role === "pharmacist") {
        try {
          const pharmacy = await getPharmacistsPharmacy(user.id);
          setPharmacyMed(pharmacy.medications || []);
        } catch (err) {
          console.error("Error fetching pharmacy data", err);
        }
      } else if (user?.role === "admin") {
        try {
          const data = await fetchMedicationCounts();
          setMedCounts(data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching medication counts", err);
          setLoading(false);
        }
      }
    };

    if (user?.id && user?.role) {
      fetchData();
    }
  }, [user?.id, user?.role]);
  useEffect(() => {
    if (user?.role !== "pharmacist" || pharmacyMed.length === 0) return;

    const today = new Date();
    const total = pharmacyMed.length;
    const inStock = pharmacyMed.filter(
      (med) => Number(med.pivot?.quantity_available) > 0
    ).length;
    const outOfStock = pharmacyMed.filter(
      (med) => Number(med.pivot?.quantity_available) === 0
    ).length;
    const expired = pharmacyMed.filter((med) => {
      const exp = new Date(med.expiry_date);
      return exp < today;
    }).length;

    setMedCounts({ total, inStock, outOfStock, expired });
    setLoading(false);
  }, [pharmacyMed, user?.role]);

  if (loading) {
    return (
      <p className="text-center font-semibold text-gray-500 dark:text-gray-300">
        Loading...
      </p>
    );
  }

  let data;
  switch (type) {
    case "totalMedications":
      data = {
        title: "Total Medications",
        count: medCounts.total,
        status: "all",
        icon: (
          <FaList className="text-green-700 bg-green-100 p-2 rounded-full text-3xl" />
        ),
        link: "See all Medications",
      };
      break;
    case "inStokMedications":
      data = {
        title: "In-Stock Medications",
        count: medCounts.inStock,
        status: "inStock",
        icon: (
          <MdInventory className="text-emerald-700 bg-emerald-100 p-2 rounded-full text-3xl" />
        ),
        link: "View In-Stock Medications",
      };
      break;
    case "outOfStokMedications":
      data = {
        title: "Out-of-Stock Medications",
        count: medCounts.outOfStock,
        status: "outOfStock",
        icon: (
          <FaBan className="text-orange-500 bg-orange-100 p-2 rounded-full text-3xl" />
        ),
        link: "View Out-of-Stock Medications",
      };
      break;
    case "expiredMedications":
      data = {
        title: "Expired Medications",
        count: medCounts.expired,
        status: "expired",
        icon: (
          <MdWarning className="text-red-700 bg-red-100 p-2 rounded-full text-3xl" />
        ),
        link: "View Expired Medications",
      };
      break;
    default:
      data = {
        title: "Unknown",
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
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ duration: 0.4 }}
      className="group bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-5 transition-all duration-100 cursor-pointer w-full max-w-md mx-auto"
    >
      <div className="justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {data.title}
        </h2>
        <span className="gap-1 text-green-600 dark:text-green-400 font-medium">
          <KeyboardArrowUpIcon />
          {medCounts.total > 0
            ? ((data.count / medCounts.total) * 100).toFixed(2)
            : 0}
          %
        </span>
      </div>

      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
        {data.count}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => handleClick(data.status)}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
        >
          {data.link}
        </button>
        <div className="transition-transform duration-300 group-hover:scale-110">
          {data.icon}
        </div>
      </div>
    </motion.div>
  );
};

export default MedItemLists;
