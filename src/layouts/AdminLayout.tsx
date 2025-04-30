import React, { useRef, useEffect, useState, useContext } from "react";
import Sidebar from "../admin/sidebar/Sidebar";
import Header from "../admin/header/Header";
import { Outlet } from "react-router-dom";
import ItemLists from "../admin/ItemList/PharmacyItemList";
import { ColorContext } from "../contexts/ColorContext";

const AdminLayout: React.FC = () => {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
	const { darkMode } = useContext(ColorContext);
	const [isSidebarShrunk, setIsSidebarShrunk] = useState<boolean>(false);

	// Toggle sidebar visibility
	const handleToggleSidebar = () => {
		setIsSidebarVisible((prev) => !prev);
	};
	const handleToggleSidebarShrunk = () => {
		console.log("Toggle sidebar called");
		setIsSidebarShrunk((prev) => !prev);
	};
	useEffect(() => {
		// Function to close sidebar if clicked outside
		const handleClickOutside = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node)
			) {
				setIsSidebarVisible(false);
			}
		};

		// Add click event listener to the entire document
		document.addEventListener("mousedown", handleClickOutside);

		// Cleanup function to remove the event listener when component unmounts
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className="admin-home"
			// style={{
			//   background: darkMode ? "#333" : "#fff",
			//   color: darkMode ? "#fff" : "#000",
			// }}
		>
			<Header
				onToggleSidebar={handleToggleSidebar}
				onToggleSidebarShrunk={handleToggleSidebarShrunk}
			/>

			<div className={`home_main ${isSidebarShrunk ? "shrunk" : ""}`}>
				<div
					ref={sidebarRef}
					className={`home_sidebar ${isSidebarVisible ? "visible" : ""} ${
						isSidebarShrunk ? "shrunk" : ""
					}`}
				>
					<Sidebar
						onLinkClick={() => setIsSidebarVisible(false)}
						isShrunk={isSidebarShrunk}
					/>
				</div>

				<main>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
