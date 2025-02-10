import React from "react";
import DrugAvailabilityChart from "../chart/DrugAvailabilityChart";
import MostSearchedMedicationsChart from "../chart/MostSearchedDrug";
import './report.scss'
const Reports: React.FC = () => {
  return (
    <div className="reports-wrapper">
      <h1 className="reports-title">Reports</h1>
      <div className="reports">
        <DrugAvailabilityChart />
        <MostSearchedMedicationsChart />
      </div>
    </div>
  );
};

export default Reports;
