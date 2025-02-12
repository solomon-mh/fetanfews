import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminDashboard.scss";
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
    <div className="dashboard-index">
      <h1 className="welcome">Welcome to Your Dashboard</h1>

      <div className="home_items">
        {user?.role === "admin"
          ? pharmacyStatusOptions.map((type) => (
              <PharmaItemLists
                key={type}
                setSelectedStatus={setSelectedPharmacyStatus}
                type={type}
              />
            ))
          : user?.role === "pharmacist" &&
            medStutusOptions.map((type) => (
              <MedItemLists
                key={type}
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
              <p className="subtitle">
                Manage pharmacies, drugs, users, and analytics effectively.
              </p>
            ) : (
              <p className="subtitle">
                Manage drugs , See Reports and Analytics effectively.
              </p>
            )}

            <div className="quick-links">
              {user?.role === "admin" ? (
                <>
                  <div className="card">
                    <Link to="/admin/manage-pharmacies" className="link">
                      {drugStoreImage ? (
                        <img src={drugStoreImage} alt=" " />
                      ) : (
                        <GroupIcon className="icon" />
                      )}
                      <h3>Manage Pharmacies</h3>
                    </Link>
                  </div>
                  <div className="card">
                    <Link to="/admin/manage-pharmacists" className="link">
                      {pharmacistImage ? (
                        <img src={pharmacistImage} alt=" " />
                      ) : (
                        <GroupIcon className="icon" />
                      )}
                      <h3>Manage Pharmacists</h3>
                    </Link>
                  </div>
                  <div className="card">
                    <Link to="/admin/users" className="link">
                      <GroupIcon className="icon" />
                      <h3>Manage Users</h3>
                    </Link>
                  </div>
                  <div className="card">
                    <Link to="/admin/settings" className="link">
                      <SettingsRoundedIcon className="icon" />
                      <h3>Settings</h3>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="card">
                    <Link to="/admin/manage-drugs" className="link">
                      {drugImage ? (
                        <img src={drugImage} alt=" " />
                      ) : (
                        <EditIcon className="icon" />
                      )}
                      <h3>Manage Drugs</h3>
                    </Link>
                  </div>
                  <div className="card">
                    <Link to="/admin/manage-categories" className="link">
                      <EditIcon className="icon" />
                      <h3> Drug Categories</h3>
                    </Link>
                  </div>

                  <div className="card">
                    <Link to="/admin/pharmacist/reports" className="link">
                      <AssessmentIcon className="icon" />
                      <h3>Reports</h3>
                    </Link>
                  </div>
                  <div className="card">
                    <Link to="/admin/pharmacist/settings" className="link">
                      <SettingsRoundedIcon className="icon" />
                      <h3>Settings</h3>
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
