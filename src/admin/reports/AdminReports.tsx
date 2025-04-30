/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	XAxis,
	YAxis,
	Bar,
	Legend,
	LineChart,
	Line,
} from "recharts";
import {
	getUserRoleReport,
	getRecentlyRegisteredUsers,
	getActiveInactiveUsersReport,
} from "../../api/userService";
import { getPharmacyStatusReport } from "../../api/pharmacyService";

const COLORS = ["#36A2EB", "#FF6384", "#FFCE56"];
const PHARMACYCOLORS = ["#FF5733", "#4CAF50"];
interface VerificationData {
	status: string;
	total_count: number;
}
const AdminReports: React.FC = () => {
	const [userRoleData, setUserRoleData] = useState<any[]>([]);
	const [recentUsers, setRecentUsers] = useState<any[]>([]);
	const [activeInactiveData, setActiveInactiveData] = useState<any[]>([]);
	const [totalPharmacies, setTotalPharmacies] = useState<number>(0);
	const [verificationReport, setVerificationReport] = useState<
		VerificationData[]
	>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const roleData = await getUserRoleReport();
				const recentUsersData = await getRecentlyRegisteredUsers();
				const activeInactiveData = await getActiveInactiveUsersReport();
				const pharmacyData = await getPharmacyStatusReport();
				setTotalPharmacies(pharmacyData.total_pharmacies || []);
				setVerificationReport(pharmacyData.verification_report || []);

				setUserRoleData(roleData || []);
				setRecentUsers(recentUsersData || []);
				setActiveInactiveData(activeInactiveData || []);
			} catch (error) {
				setError("Failed to load reports. Please try again later.");
			}
		};

		fetchData();
	}, []);

	return (
		<div className="reports-container">
			<h1> Reports</h1>

			{error && <p className="error-message">{error}</p>}

			{/* User Role Distribution Pie Chart */}
			<div className="chart-container">
				<div className="chart-section">
					<h2>Pharmacy Status Report</h2>
					{totalPharmacies > 0 ? (
						<div>
							<p className="total-count">
								Total Pharmacies: <strong>{totalPharmacies}</strong>
							</p>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={verificationReport}
										dataKey="total_count"
										nameKey="status"
										cx="50%"
										cy="50%"
										outerRadius={100}
										label
									>
										{verificationReport.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={PHARMACYCOLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					) : (
						<p>No pharmacy data available.</p>
					)}
				</div>

				<div className="chart-section">
					<h2>User Role Distribution</h2>
					{userRoleData.length > 0 ? (
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={userRoleData}
									dataKey="total_count"
									nameKey="role"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label
								>
									{userRoleData.map((_, index) => (
										<Cell key={index} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					) : (
						<p>No user role data available.</p>
					)}
				</div>

				{/* Recently Registered Users Line Chart */}
				<div className="chart-section">
					<h2>Recently Registered Users</h2>
					{recentUsers.length > 0 ? (
						<div
							style={{
								backgroundColor: "#f8f9fa",
								padding: "16px",
								borderRadius: "8px",
							}}
						>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={recentUsers}>
									<XAxis dataKey="date_joined" />
									<YAxis allowDecimals={false} />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="total_count"
										stroke="#4BC0C0"
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					) : (
						<p>No recently registered users.</p>
					)}
				</div>

				{/* Active vs Inactive Users Bar Chart */}
				<div className="chart-section">
					<h2>Active vs Inactive Users</h2>
					{activeInactiveData.length > 0 ? (
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={activeInactiveData}>
								<XAxis dataKey="is_active" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="total_count" fill="#82ca9d" />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<p>No active/inactive user data.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminReports;
