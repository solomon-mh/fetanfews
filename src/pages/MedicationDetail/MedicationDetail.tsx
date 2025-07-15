import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useSearchParams } from "react-router-dom";
import {
  addMostSearchedMedications,
  getPharmacyMedicationDetail,
} from "../../api/medicationService";
import {
  FaPills,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFlask,
  FaIndustry,
  FaPrescriptionBottleAlt,
  FaExclamationTriangle,
  FaBookMedical,
} from "react-icons/fa";
import defaultMedicationImage from "../../assets/default-pill-image.png";
import { RiMedicineBottleLine } from "react-icons/ri";
import OrderCard from "../../components/OrderCard";

const MedicationDetail = () => {
  const { pharmacyName } = useParams();
  const [searchParams] = useSearchParams();
  const pharmacyId = searchParams.get("pham_id");
  const medicationId = searchParams.get("med_id");
  interface MedicationPivot {
    price: number;
    manufacturer: string;
  }

  interface Medication {
    name: string;
    description?: string;
    dosage_form: string;
    dosage_strength: string;
    expiry_date: string;
    prescription_required: boolean;
    side_effects?: string;
    usage_instructions?: string;
    image?: string;
    pivot: MedicationPivot;
  }

  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicationDetails = async () => {
      if (!pharmacyId || !medicationId) {
        setError("Invalid pharmacy or medication ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await getPharmacyMedicationDetail(
          pharmacyId,
          medicationId
        );
        if (error) {
          setError(error);
        } else {
          setMedication(data);
        }
      } catch {
        setError("Failed to fetch medication details");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicationDetails();
  }, [pharmacyId, medicationId]);

  useEffect(() => {
    const trackSearch = async () => {
      try {
        if (medication?.name && pharmacyId) {
          await addMostSearchedMedications({
            name: medication.name,
            pharmacy_id: Number(pharmacyId),
          });
        }
      } catch (error) {
        console.error("Failed to track search:", error);
      }
    };

    trackSearch();
  }, [medication?.name, pharmacyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center max-w-md"
        >
          <div className="text-red-500 dark:text-red-400 text-5xl mb-4">
            <FaExclamationTriangle />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Error Loading Medication
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!medication) return null;

  const detailItems = [
    {
      icon: <FaMoneyBillWave className="text-green-500" />,
      label: "Price",
      value: `${medication.pivot.price} Birr`,
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <RiMedicineBottleLine className="text-blue-500" />,
      label: "Description",
      value: medication.description || "No description available",
      color: "text-gray-700 dark:text-gray-300",
    },
    {
      icon: <FaPills className="text-purple-500" />,
      label: "Dosage Form",
      value: medication.dosage_form,
      color: "text-gray-700 dark:text-gray-300",
    },
    {
      icon: <FaFlask className="text-amber-500" />,
      label: "Dosage Strength",
      value: medication.dosage_strength,
      color: "text-gray-700 dark:text-gray-300",
    },
    {
      icon: <FaIndustry className="text-indigo-500" />,
      label: "Manufacturer",
      value: medication.pivot.manufacturer,
      color: "text-gray-700 dark:text-gray-300",
    },
    {
      icon: <FaCalendarAlt className="text-red-500" />,
      label: "Expiry Date",
      value: new Date(medication.expiry_date).toLocaleDateString(),
      color: "text-gray-700 dark:text-gray-300",
    },
    {
      icon: <FaPrescriptionBottleAlt className="text-yellow-500" />,
      label: "Prescription Required",
      value: medication.prescription_required ? "Yes" : "No",
      color: medication.prescription_required
        ? "text-red-500"
        : "text-green-500",
    },
    {
      icon: <FaExclamationTriangle className="text-orange-500" />,
      label: "Side Effects",
      value: medication.side_effects || "N/A",
      color: "text-gray-700 dark:text-gray-300",
    },
    {
      icon: <FaBookMedical className="text-teal-500" />,
      label: "Usage Instructions",
      value: medication.usage_instructions || "N/A",
      color: "text-gray-700 dark:text-gray-300",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen py-30 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600">
            {medication.name}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-lg text-gray-600 dark:text-gray-400"
          >
            Available at{" "}
            {pharmacyName ? decodeURIComponent(pharmacyName) : "this pharmacy"}
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-12 lg:px-24">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className=""
          >
            <div className="relative w-full  max-w-md lg:max-w-lg">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="overflow-hidden rounded-2xl shadow-xl border-4 border-white dark:border-gray-800"
              >
                <div>
                  <img
                    src={
                      medication.image
                        ? medication.image
                        : defaultMedicationImage
                    }
                    alt={medication.name}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.src = defaultMedicationImage;
                    }}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute lg:relative lg:w-fit lg:px-3 -bottom-4 -right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
              >
                <span className="font-bold">{medication.pivot.price} Birr</span>
              </motion.div>
            </div>
            <div className="delivery my-8">
              <OrderCard
                medicationName={medication.name}
                pharmacyName={pharmacyName ?? ""}
                prescriptionRequired={medication.prescription_required}
              />
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h2 className="text-xl dark:text-white font-bold mb-4 flex items-center gap-2">
                <FaPills className="text-indigo-600 dark:text-indigo-400" />
                Medication Details
              </h2>

              <div className="space-y-4">
                <AnimatePresence>
                  {detailItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1">{item.icon}</div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {item.label}
                        </p>
                        <p className={`${item.color}`}>{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Additional Info */}
            {(medication.side_effects || medication.usage_instructions) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
              >
                <h2 className="text-xl dark:text-white font-bold mb-4 flex items-center gap-2">
                  <FaBookMedical className="text-indigo-600 dark:text-indigo-400" />
                  Important Information
                </h2>

                {medication.side_effects && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <FaExclamationTriangle className="text-orange-500" />
                      Side Effects
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {medication.side_effects}
                    </p>
                  </div>
                )}

                {medication.usage_instructions && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <FaBookMedical className="text-teal-500" />
                      Usage Instructions
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      {medication.usage_instructions}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicationDetail;
