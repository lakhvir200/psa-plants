"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar userType="admin" isOpen={isSidebarOpen} />
      <main
        style={{
          marginLeft: isSidebarOpen ? "150px" : "0",
          transition: "margin-left 0.3s ease-in-out",
          padding: "10px",
          marginTop: "40px", // Account for Navbar height
        }}
      >
        {children}
      </main>
    </div>
  );
}
