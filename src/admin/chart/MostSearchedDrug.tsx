/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPhaMostSearchedMedications } from "../../api/medicationService";
import { useAuth } from "../../contexts/AuthContext";

const MostSearchedMedicationsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        if (user) {
          const data = await getPhaMostSearchedMedications(user?.id);
          // Format the data for the chart
          const formattedData = data.map(
            (medication: { name: string; search_count: number }) => ({
              name: medication.name,
              total: medication.search_count,
            })
          );

          setChartData(formattedData);
        }
      } catch (err: any) {
        setError("Error fetching medications");
      }
    };

    fetchMedications();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      {error && (
        <p className="text-red-500 text-center mt-6 mb-3 bg-red-100 dark:bg-red-900 dark:text-red-300 px-4 py-3 rounded-md text-sm animate-pulse">
          {error}
        </p>
      )}
      {chartData.length === 0 ? (
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
        <>
          <div className="title">
            <p> Top 10 Frequently Searched Drugs</p>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
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
        </>
      )}
    </div>
  );
};

export default MostSearchedMedicationsChart;
