/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ColorContext } from "../../contexts/ColorContext";
import SnackbarComponent from "../modals/SnackbarComponent";
import { fetchMedicationsData } from "../../api/pharmacyService";
import { medicationType } from "../../utils/interfaces";
import { useAuth } from "../../contexts/AuthContext";
import { usePharmacyStore } from "../../store/usePharmacyStore";
const DrugAvailabilityChart: React.FC = () => {
  const { user } = useAuth();
  const { pharmacyMed } = usePharmacyStore();
  const showSnackbar = useCallback(
    (message: string, type: "success" | "error") => {
      setSnackbar({ open: true, message, type });
    },
    []
  );
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [data, setData] = useState([
    { name: "In Stock", total: 0 },
    { name: "Out of Stock", total: 0 },
    { name: "Expired", total: 0 },
  ]);
  const { darkMode } = useContext(ColorContext);

  const colorStyle = {
    color: darkMode ? "white" : "#000",
  };

  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        let inStock, outOfStock, expired;
        if (user?.role === "admin") {
          const medications = await fetchMedicationsData();
          inStock = medications.filter(
            (med: medicationType) => med.pivot?.stock_status
          ).length;
          outOfStock = medications.filter(
            (med: medicationType) => !med.pivot?.stock_status
          ).length;
          expired = medications.filter((med: medicationType) => {
            const expiryDate = new Date(med.expiry_date);
            const currentDate = new Date();
            return expiryDate < currentDate;
          }).length;
        } else if (user?.role === "pharmacist") {
          inStock = pharmacyMed.filter(
            (med: medicationType) => med.pivot?.stock_status
          ).length;
          outOfStock = pharmacyMed.filter(
            (med: medicationType) => !med.pivot?.stock_status
          ).length;
          expired = pharmacyMed.filter((med: medicationType) => {
            const expiryDate = new Date(med.expiry_date);
            const currentDate = new Date();
            return expiryDate < currentDate;
          }).length;
        }
        setData([
          { name: "In Stock", total: inStock },
          { name: "Out of Stock", total: outOfStock },
          { name: "Expired", total: expired },
        ]);
      } catch (error: any) {
        showSnackbar(error.message, "error");
      }
    };

    fetchAvailabilityData();
  }, [pharmacyMed, showSnackbar, user?.role]);

  return (
    <div className="chart">
      {data.every((item) => item.total === 0) ? (
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            No data available for chart
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            We couldn't find any information to display right now.
          </p>
        </div>
      ) : (
        <div>
          <div className="title">
            <p style={colorStyle}>Drug Availability Report</p>
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="availability" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="gray" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#availability)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default DrugAvailabilityChart;
