import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import pharmacistImage from "../../assets/images/pharmacist.jpeg";
import drugImage from "../../assets/images/drugs.jpeg";
import drugStoreImage from "../../assets/images/drugstore.jpg";
import MedItemLists from "../ItemList/MedicationItemList";

import {
  Group as GroupIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  SettingsRounded as SettingsRoundedIcon,
} from "@mui/icons-material";
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
  const MedStatus = queryParams.get("med-status");

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
      <h1 className="text-4xl font-extrabold mb-10 text-indigo-600 dark:text-indigo-400">
        Welcome to Your Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
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
        ) : MedStatus && user?.role === "pharmacist" ? (
          <MedicationTable filter={selectedMedStatus} />
        ) : (
          <>
            {user?.role === "admin" ? (
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
                Manage pharmacies, drugs, users, and analytics effectively.
              </p>
            ) : (
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
                Manage drugs, See Reports and Analytics effectively.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {user?.role === "admin" ? (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl">
                    <Link
                      to="/admin/manage-pharmacies"
                      className="flex flex-col items-center text-center no-underline"
                    >
                      {drugStoreImage ? (
                        <img
                          src={drugStoreImage}
                          alt="Manage Pharmacies"
                          className="w-20 h-20 object-cover rounded-full mb-4 border-2 border-indigo-500"
                        />
                      ) : (
                        <GroupIcon className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
                      )}
                      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        Manage Pharmacies
                      </h3>
                    </Link>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl">
                    <Link
                      to="/admin/manage-pharmacists"
                      className="flex flex-col items-center text-center no-underline"
                    >
                      {pharmacistImage ? (
                        <img
                          src={pharmacistImage}
                          alt="Manage Pharmacists"
                          className="w-20 h-20 object-cover rounded-full mb-4 border-2 border-indigo-500"
                        />
                      ) : (
                        <GroupIcon className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
                      )}
                      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        Manage Pharmacists
                      </h3>
                    </Link>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl">
                    <Link
                      to="/admin/users"
                      className="flex flex-col items-center text-center no-underline"
                    >
                      <GroupIcon className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
                      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        Manage Users
                      </h3>
                    </Link>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl">
                    <Link
                      to="/admin/settings"
                      className="flex flex-col items-center text-center no-underline"
                    >
                      <SettingsRoundedIcon className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
                      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        Settings
                      </h3>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl">
                    <Link
                      to="/admin/manage-drugs"
                      className="flex flex-col items-center text-center no-underline"
                    >
                      {drugImage ? (
                        <img
                          src={drugImage}
                          alt="Manage Drugs"
                          className="w-20 h-20 object-cover rounded-full mb-4 border-2 border-indigo-500"
                        />
                      ) : (
                        <EditIcon className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
                      )}
                      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        Manage Drugs
                      </h3>
                    </Link>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl">
                    <Link
                      to="/admin/manage-categories"
                      className="flex flex-col items-center text-center no-underline"
                    >
                      <EditIcon className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
                      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        Drug Categories
                      </h3>
                    </Link>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl">
                    <Link
                      to="/admin/pharmacist/reports"
                      className="flex flex-col items-center text-center no-underline"
                    >
                      <AssessmentIcon className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
                      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        Reports
                      </h3>
                    </Link>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl">
                    <Link
                      to="/admin/pharmacist/settings"
                      className="flex flex-col items-center text-center no-underline"
                    >
                      <SettingsRoundedIcon className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
                      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                        Settings
                      </h3>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default AdminHome;
