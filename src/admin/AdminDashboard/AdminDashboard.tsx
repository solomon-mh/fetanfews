import React,{useState} from "react";
import { Link,useLocation } from "react-router-dom";
import "./AdminDashboard.scss";
import {
  Group as GroupIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  SettingsRounded as SettingsRoundedIcon,
} from "@mui/icons-material";
import ItemLists from "../ItemList/ItemList";
import PharmacyTable from "../tableList/PharmacyTable";

const AdminHome: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  return (
    <div className="dashboard-index">
      <h1 className="welcome">Welcome to Admin Dashboard</h1>

      <div className="home_items">
        <ItemLists setSelectedStatus={ setSelectedStatus} type="totalPharmacies" />
        <ItemLists setSelectedStatus={ setSelectedStatus} type="approvedPharmacies" />
        <ItemLists setSelectedStatus={ setSelectedStatus} type="pendingPharmacies" />
        <ItemLists setSelectedStatus={ setSelectedStatus} type="rejectedPharmacies" />
      </div>
      <>
        {status? (
          <PharmacyTable status={selectedStatus} />
        ) : (<>
          <p className="subtitle">
          Manage pharmacies, drugs, users, and analytics effectively.
        </p>
  
        <div className="quick-links">
          <div className="card">
            <Link to="/admin/manage-pharmacies" className="link">
              <GroupIcon className="icon" />
              <h3>Manage Pharmacies</h3>
            </Link>
          </div>
          <div className="card">
            <Link to="/admin/drugs" className="link">
              <EditIcon className="icon" />
              <h3>Manage Drugs</h3>
            </Link>
          </div>
          <div className="card">
            <Link to="/admin/users" className="link">
              <GroupIcon className="icon" />
              <h3>Manage Users</h3>
            </Link>
          </div>
          <div className="card">
            <Link to="/admin/analytics" className="link">
              <AssessmentIcon className="icon" />
              <h3>Search Analytics</h3>
            </Link>
          </div>
          <div className="card">
            <Link to="/admin/settings" className="link">
              <SettingsRoundedIcon className="icon" />
              <h3>Settings</h3>
            </Link>
          </div>
          <div className="card">
            <Link to="/admin/profile" className="link">
              <AccountCircleIcon className="icon" />
              <h3>Profile</h3>
            </Link>
          </div>
            </div> 
            </>
        )

        }
        
      </>
     
    </div>
  );
};

export default AdminHome;
