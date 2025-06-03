
import React from 'react';
//import './AdminDashboard.css';
import { Box, Button } from "@mui/material";
export default function Home({ children }) {
  return (
    <div>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px" marginTop="20px">
          <Box display="flex" gap="10px">
            <Button variant="contained" color="secondary">Upcoming Services</Button>
            <Button variant="contained" color="secondary">CMC</Button>
            <Button variant="contained" color="secondary">Out of Action</Button>
            {/* <Button variant="contained" color="secondary">Critical Spares</Button> */}
          </Box>          
        </Box>
       

        {/* <h2>Welcome to the Admin Dashboard</h2>
        <p>Here you can manage users, view reports, and configure settings.</p> */}
      </div>
  );
}
