import React, { useState, useEffect } from "react";

import { fetchPharmacyData } from "../../api/pharmacyService";
import SnackbarComponent from "../modals/SnackbarComponent";
import './PharmacyTable.scss'
interface PharmacyTableProps {
  status:string
}

const PharmacyTable: React.FC<PharmacyTableProps> = ({ status = "all" }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  // Filter pharmacies based on the passed status
  const filteredPharmacies = Array.isArray(pharmacies)
  ? pharmacies.filter((pharmacy) =>
      status === "all" ? true : pharmacy.status.toLowerCase() === status.toLowerCase()
    )
  : [];
  useEffect(() => {
    const fetchPharmacy = async () => {
      try {
        const data = await fetchPharmacyData();
        setPharmacies(data);
        console.log("pharmacy data", data);
      } catch {
        showSnackbar("Failed to fetch medications.", "error");
      }
    };
    fetchPharmacy();
  }, []);
  return (
    <>
      <div className="pharmacy-table">
        <h2>
          {status === "all"
            ? "All Pharmacies"
            : `${status.charAt(0).toUpperCase() + status.slice(1)} Pharmacies`}
        </h2>

        {filteredPharmacies.length === 0 ? (
          <p className="no-data">No {status} pharmacies found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                {/* <th>Owner</th> */}
                <th>Address</th>
                <th>Phone Number</th>
                <th>email</th>
                <th>Oprating hour</th>
                <th>Delivery avliable</th>
                <th>WebSite</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPharmacies.map((pharmacy) => (
                <tr key={pharmacy.id}>
                  <td>
                    <img src={pharmacy.image} alt="No Image" />{" "}
                  </td>

                  <td>{pharmacy.name}</td>
                  {/* <td>{pharmacy.owner}</td> */}
                  <td>{pharmacy.address}</td>
                  <td>{pharmacy.phone}</td>
                  <td>{pharmacy.email}</td>
                  <td>{pharmacy.operating_hours}</td>
                  <td>{pharmacy.delivery_available}</td>
                  <td>{pharmacy.website}</td>

                  <td className={`status ${pharmacy.status}`}>
                    {pharmacy.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </>
  );
};

export default PharmacyTable;
