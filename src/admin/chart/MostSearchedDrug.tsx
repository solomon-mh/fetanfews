/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getPhaMostSearchedMedications } from '../../api/medicationService';

const MostSearchedMedicationsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await getPhaMostSearchedMedications();
        
        // Format the data for the chart
        const formattedData = data.map((medication: { name: string; search_count: number }) => ({
          name: medication.name, 
          total: medication.search_count, 
        }));

        setChartData(formattedData);
      } catch (err:any) {
        setError('Error fetching medications');
      }
    };

    fetchMedications();
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      {error && <p>{error}</p>}
      {chartData.length === 0 ? (
        <p>No data available for chart.</p>
      ) : (
        <>
      <div className="title">
            <p > Top 10 Frequently Searched Drugs</p>
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
        </>)
      }
     
    </div>
  );
};

export default MostSearchedMedicationsChart;
