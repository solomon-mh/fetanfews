/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPharmacyMedicationDetail } from "../../api/medicationService";
import drugImage from "../../assets/images/drugs.jpeg";
import defaultMedicationImage from "../../assets/default-pill-image.png";

const MedicationDetail = () => {
  const { pharmacyName } = useParams();

  const [searchParams] = useSearchParams();

  const pharmacyId = searchParams.get("pham_id");
  const medicationId = searchParams.get("med_id");
  const [medication, setMedication] = useState<any>(null);
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
      const { data, error } = await getPharmacyMedicationDetail(
        pharmacyId,
        medicationId
      );
      if (error) {
        setError(error);
      } else {
        setMedication(data);
      }
      setLoading(false);
    };

    fetchMedicationDetails();
  }, [pharmacyId, medicationId]);

  if (loading) return <p>Loading medication details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
            {medication?.name}{" "}
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
              (From{" "}
              {pharmacyName
                ? decodeURIComponent(pharmacyName)
                : "Unknown Pharmacy"}
              )
            </span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Medication Image */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <img
                src={
                  medication.image
                    ? `http://127.0.0.1:8000${medication.image}`
                    : drugImage
                }
                alt={medication.name}
                className="w-full h-auto object-cover rounded-2xl shadow-lg border dark:border-gray-700"
                onError={(e) => {
                  e.currentTarget.src = defaultMedicationImage;
                }}
              />
            </div>

            {/* Medication Details */}
            <div className="space-y-4 text-sm sm:text-base">
              <p>
                <span className="font-semibold">💰 Price:</span>{" "}
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {medication.pivot.price} Birr
                </span>
              </p>
              <p>
                <span className="font-semibold">📝 Description:</span>{" "}
                {medication.description || "No description available."}
              </p>
              <p>
                <span className="font-semibold">💊 Dosage Form:</span>{" "}
                {medication.dosage_form}
              </p>
              <p>
                <span className="font-semibold">🧪 Dosage Strength:</span>{" "}
                {medication.dosage_strength}
              </p>
              <p>
                <span className="font-semibold">🏭 Manufacturer:</span>{" "}
                {medication.pivot.manufacturer}
              </p>
              <p>
                <span className="font-semibold">📅 Expiry Date:</span>{" "}
                {new Date(medication.expiry_date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">🧾 Prescription Required:</span>{" "}
                {medication.prescription_required ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold">⚠️ Side Effects:</span>{" "}
                {medication.side_effects || "N/A"}
              </p>
              <p>
                <span className="font-semibold">📖 Usage Instructions:</span>{" "}
                {medication.usage_instructions || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;
