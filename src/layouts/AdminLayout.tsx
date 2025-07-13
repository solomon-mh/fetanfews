import React, { useRef, useEffect, useState } from "react";
import Sidebar from "../admin/sidebar/Sidebar";
import Header from "../admin/header/Header";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [isSidebarShrunk, setIsSidebarShrunk] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleToggleSidebarShrunk = () => {
    setIsSidebarShrunk((prev) => !prev);
  };

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
      <Header
        onToggleSidebar={handleToggleSidebar}
        onToggleSidebarShrunk={handleToggleSidebarShrunk}
        isSidebarVisible={isSidebarVisible}
      />
      <div
        ref={sidebarRef}
        className={`transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "block w-60 z-[99]" : "hidden w-0"
        } lg:block`}
      >
        <Sidebar
          onLinkClick={() => setIsSidebarVisible((prev) => !prev)}
          isShrunk={isSidebarShrunk}
        />
      </div>
      <main
        className={`flex-1 ml-0 md:ml-0  transition-all duration-300 ease-in-out px-4 py-6 md:px-8  ${
          isSidebarShrunk ? "md:ml-20" : "lg:ml-60"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
