import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../api/auth";
import { CustomUser } from "../../utils/interfaces";
import { FaSearch } from "react-icons/fa";

const UserList: React.FC = () => {
	const [users, setUsers] = useState<CustomUser[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<CustomUser[]>([]);
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const usersPerPage = 5;

	useEffect(() => {
		const getUsers = async () => {
			try {
				const data = await fetchUsers();
				setUsers(data);
				setFilteredUsers(data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		getUsers();
	}, []);

	useEffect(() => {
		const filtered = users.filter(
			(user) =>
				user.first_name.toLowerCase().includes(search.toLowerCase()) ||
				user.last_name.toLowerCase().includes(search.toLowerCase()) ||
				(user.email &&
					user.email.toLowerCase().includes(search.toLowerCase())) ||
				(user.phone_number && user.phone_number.includes(search))
		);
		setFilteredUsers(filtered);
		setCurrentPage(1); // Reset pagination on search
	}, [search, users]);

	// Pagination
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers
		? filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
		: [];

	const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

	return (
		<div className="user-list">
			<h2>List of Users </h2>

			{/* Search Input */}
			<div className="search-container">
				<FaSearch className="search-icon" />
				<input
					type="text"
					placeholder="Search by name, email, or phone..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="search-input"
				/>
			</div>

			{/* User Table */}
			<table>
				<thead>
					<tr>
						<th>No</th>
						<th>Name</th>

						<th>Email</th>
						<th>Phone</th>
						<th>Role</th>
					</tr>
				</thead>
				<tbody>
					{currentUsers.length > 0 ? (
						currentUsers.map((user, index) => (
							<tr key={user.id}>
								<td>{indexOfFirstUser + index + 1}</td>
								<td>
									{user.first_name} {user.last_name}
								</td>
								<td>{user.email || "N/A"}</td>
								<td>{user.phone_number || "N/A"}</td>
								<td>{user.role}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={5} className="no-data">
								No users found
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Pagination */}
			<div className="pagination">
				<button
					disabled={currentPage === 1}
					onClick={() => setCurrentPage(currentPage - 1)}
				>
					◀ Previous
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button
					disabled={currentPage === totalPages || totalPages === 0}
					onClick={() => setCurrentPage(currentPage + 1)}
				>
					Next ▶
				</button>
			</div>
		</div>
	);
};

export default UserList;
