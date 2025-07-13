import React, { useRef, useEffect, useState } from "react";
import Sidebar from "../admin/sidebar/Sidebar";
import Header from "../admin/header/Header";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [, setIsSidebarVisible] = useState<boolean>(false);
  const [isSidebarShrunk, setIsSidebarShrunk] = useState<boolean>(false);

  // Toggle sidebar visibility
  const handleToggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleToggleSidebarShrunk = () => {
    setIsSidebarShrunk((prev) => !prev);
  };

  // Hide sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        onToggleSidebarShrunk={handleToggleSidebarShrunk}
      />

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          onLinkClick={() => setIsSidebarVisible((prev) => !prev)}
          isShrunk={isSidebarShrunk}
        />

        {/* Main Content */}
        <main
          className={`flex-1 ml-0 md:ml-0  transition-all duration-300 ease-in-out px-4 py-6 md:px-8  ${
            isSidebarShrunk ? "md:ml-20" : "lg:ml-60"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
