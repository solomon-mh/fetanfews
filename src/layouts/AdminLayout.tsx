import React, { useRef, useEffect, useState, useContext } from "react";
import Sidebar from "../admin/sidebar/Sidebar";
import Header from "../admin/header/Header";
import { Outlet } from "react-router-dom";
import ItemLists from "../admin/ItemList/ItemList";
import "./adminlayout.scss";
import { ColorContext } from "../contexts/ColorContext";

const AdminLayout: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const { darkMode } = useContext(ColorContext);

  // Toggle sidebar visibility
  const handleToggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
    console.log(isSidebarVisible);
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
      <Header onToggleSidebar={handleToggleSidebar} />

      <div className="home_main">
        <div
          ref={sidebarRef}
          className={`home_sidebar ${isSidebarVisible ? "visible" : ""}`}
        >
          <Sidebar onLinkClick={() => setIsSidebarVisible(false)} />
        </div>

        <main>
       
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
