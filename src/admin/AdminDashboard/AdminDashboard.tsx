import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import MedItemLists from "../ItemList/MedicationItemList";

import PharmaItemLists from "../ItemList/PharmacyItemList";
import PharmacyTable from "../tableList/PharmacyTable";
import { useAuth } from "../../contexts/AuthContext";
import MedicationTable from "../tableList/MedicationTable";

const AdminHome: React.FC = () => {
  const [selectedMedStatus, setSelectedMedStatus] = useState<string>("");
  const [selectedPharmacyStatus, setSelectedPharmacyStatus] =
    useState<string>("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pharmStatus = queryParams.get("status");

  const { user } = useAuth();
  const pharmacyStatusOptions = [
    "totalPharmacies",
    "approvedPharmacies",
    "pendingPharmacies",
    "rejectedPharmacies",
  ];
  const medStutusOptions = [
    "totalMedications",
    "inStokMedications",
    "outOfStokMedications",
    "expiredMedications",
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user?.role === "admin"
          ? pharmacyStatusOptions.map((type, index) => (
              <PharmaItemLists
                key={index}
                setSelectedStatus={setSelectedPharmacyStatus}
                type={type}
              />
            ))
          : user?.role === "pharmacist" &&
            medStutusOptions.map((type, index) => (
              <MedItemLists
                key={index}
                setSelectedStatus={setSelectedMedStatus}
                type={type}
              />
            ))}
      </div>

      <>
        {pharmStatus && user?.role === "admin" ? (
          <PharmacyTable status={selectedPharmacyStatus} />
        ) : (
          <MedicationTable filter={selectedMedStatus} />
        )}
      </>
    </div>
  );
};

export default AdminHome;
