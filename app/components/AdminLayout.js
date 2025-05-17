// components/AdminLayout.tsx

"use client"; // Required for client-side hooks
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
      {/* <Sidebar userType="admin" isOpen={isSidebarOpen} /> */}
      <main
        style={{
          marginLeft: isSidebarOpen ? "0" : "0", // Adjusted for wider sidebar when open
          transition: "margin-left 0.3s ease-in-out",
          padding: "20px",
          marginTop: "60px", // Adjusted to account for Navbar height
        }}
      >
        {children}
      </main>
    </div>
  );
}
