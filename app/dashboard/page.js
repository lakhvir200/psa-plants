import React from 'react';
import './AdminDashboard.css'; // Import external CSS
import { Paper, MenuItem, Select, FormControl, InputLabel, Box, Button, TextField } from "@mui/material";
export default function AdminDashboard() {

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px" marginTop="20px">
        {/* Search Box */}
        {/* <TextField
            label="Search"
            variant="outlined"
            type="search"
            size="small"
            style={{ width: "15%" }}
            onChange={handleSearch}
          /> */}
        {/* Buttons */}
        <Box display="flex" gap="10px">
          {/* <Button
             onClick={handleOpen}
              variant="outlined"
              startIcon={<ArrowUpwardOutlinedIcon />}
            >
              Export
            </Button> */}
          <Button
            // onClick={AddNewEquipment}
            variant="contained" color="secondary">
           Tasks
          </Button>
          <Button
            // onClick={AddNewEquipment}
            variant="contained" color="secondary">
            CMC/AMC
          </Button>
          <Button
            // onClick={AddNewEquipment}
            variant="contained" color="secondary">
           Out of Action
          </Button>
          <Button
            // onClick={AddNewEquipment}
            variant="contained" color="secondary">
          Critical spares
          </Button>
        </Box>
      </Box>
      <h2>Welcome to the Admin Dashboard</h2>
      <p>Here you can manage users, view reports, and configure settings.</p>
    </div>
  );
}
