/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useContext } from "react";
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
const DrugAvailabilityChart: React.FC = () => {
  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ open: true, message, type });
  };
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
        const medications = await fetchMedicationsData();
        const inStock = medications.filter(
          (med: medicationType) => med.stock_status
        ).length;
        const outOfStock = medications.filter(
          (med: medicationType) => !med.stock_status
        ).length;
        const expired = medications.filter((med: medicationType) => {
          const expiryDate = new Date(med.expiry_date);
          const currentDate = new Date();
          return expiryDate < currentDate;
        }).length;

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
  }, []);

  return (
    <div className="chart">
      {data.every((item) => item.total === 0) ? (
        <p style={colorStyle}>No data available</p>
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
