/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import SnackbarComponent from "../modals/SnackbarComponent";
import "./tables.scss";
import { medicationType } from "../../utils/interfaces";
import { fetchMedicationsData } from "../../api/pharmacyService";

interface MedicationTableProps {
  filter: string;
}

const MedicationTable: React.FC<MedicationTableProps> = ({
  filter = "all",
}) => {
  const [medications, setMedications] = useState<medicationType[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMedicationsData();
        setMedications(data);
      } catch (error:any) {
        showSnackbar(error.message, "error"); 
      }
    };
    fetchData();
  }, []);

  // Apply filtering based on stock status and expiry date
  const filteredMedications = medications.filter((medication) => {
    if (filter === "inStock") return medication.stock_status === true;
    if (filter === "outOfStock") return medication.stock_status === false;
    if (filter === "expired")
      return new Date(medication.expiry_date) < new Date();
    return true;
  });

  return (
    <>
      <div className="medication-table">
        <h2>
          {filter === "all"
            ? "All Medications"
            : filter === "inStock"
            ? "In-Stock Medications"
            : filter === "outOfStock"
            ? "Out-of-Stock Medications"
            : "Expired Medications"}
        </h2>

        {filteredMedications.length === 0 ? (
          <p className="no-data">No {filter} medications found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Category</th>
                <th>Dosage Form</th>
                <th>Dosage Strength</th>
                <th>Manufacturer</th>
                <th>Expiry Date</th>
                <th>Prescription Required</th>
                <th>Quantity Available</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((medication) => (
                <tr key={medication.id}>
                  <td>
                    <img
                      src={`http://127.0.0.1:8000${medication.image}`}
                      alt="No Image"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{medication.name}</td>
                  <td>{medication.price} Birr</td>
                  <td
                    className={
                      medication.stock_status ? "in-stock" : "out-of-stock"
                    }
                  >
                    {medication.stock_status ? "In Stock" : "Out of Stock"}
                  </td>
                  <td>{medication.category_name}</td>
                  <td>{medication.dosage_form}</td>
                  <td>{medication.dosage_strength}</td>
                  <td>{medication.manufacturer}</td>
                  <td>
                    {new Date(medication.expiry_date).toLocaleDateString()}
                  </td>
                  <td>{medication.prescription_required ? "Yes" : "No"}</td>
                  <td>{medication.quantity_available}</td>
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

export default MedicationTable;
