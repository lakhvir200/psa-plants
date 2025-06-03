// AdminDashboard.jsx
"use client"
import React from 'react';
import Home from "../page.jsx";
import './AdminDashboard.css';
import { Box, Button } from "@mui/material";

export default function AdminDashboard() {
  return (
    <Home>
      <div>
        
        <h2>Welcome to the Admin Dashboard</h2>
        <p>Here you can manage users, view reports, and configure settings.</p>
      </div>
    </Home>
  );
}
