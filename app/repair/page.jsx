"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import CustomDataGrid from "../components/DataGrid.jsx";
import { Container, Typography, CircularProgress, Grid } from '@mui/material';
import { Paper, MenuItem, Select, FormControl, InputLabel, Box, Button, TextField } from "@mui/material";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ReusableModal from "../components/DialogPopup";
import EditCMC from '../components/EditCmcForm.jsx'
import EditService from '../components/EditServiceForm.jsx'
import EquipmentDetail from '../components/EditCmcForm.jsx';
import { fetchHospitalData, fetchSearchEquipments, fetchSearchHospitalData } from '../util/api.js';
import debounce from "lodash.debounce";
import ExportToExcelButton from '../components/ExportToExcelButton.jsx';

export default function ServicePage() {
  const isFirstRender = useRef(true);
  // Filter states 
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  // search
  const [searchText, setSearchText] = useState('');

  //dialog box
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialogName, setOpenDialogName] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [dialogContent, setDialogContent] = useState(null);
  const handleOpen = () => {
    setIsModalOpen(true);
    //console.log("Opening modal...");
  };
  const handleClose = () => {
    setIsModalOpen(false);
    // console.log("closing modal...");
  }
  const handleSearch = (e) => {
    if (e.target.value.length === 0 || e.target.value.length > 2)
      setSearchText(e.target.value || "");
  }
  const fetchEquipments = async () => {
    try {
      const res = await fetch("/api/repair");
      const data = await res.json();
      // console.log("Fetched data:", data);

      // ensure it’s an array and includes `id`
      if (Array.isArray(data)) {
        const formatted = data.map((item, index) => ({
          id: item.id || index, // fallback to index
          ...item,
        }));
        setEquipments(formatted);
      } else {
        console.warn("Expected array, got:", data);
      }
    } catch (error) {
      console.error("Error fetching equipments:", error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(searchText)
  useEffect(() => {
    fetchEquipments();
  }, []);

  console.log(equipments)
  // Debounced search function to prevent rapid API calls
  const loadData = debounce(async (filters) => {
    try {
      const data = await fetchSearchHospitalData(filters);
      // console.log("Fetched Data:", data);
      setEquipments(data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, 300); // Debounce delay in milliseconds
  useEffect(() => {
    const filters = {
      search: searchText || null,

    };
    // Skip the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    loadData(filters);
    // Cleanup debounce on unmount
    return () => loadData.cancel();
  }, [searchText]);
  const columnDefs = [
    { headerName: "ID", field: "psa_id", width: 70 },
    { headerName: "CUSTOMER NAME", field: "customer_name", width: 200 },
    // { headerName: "STATE", field: "state", width: 150 },
    // { headerName: "CITY", field: "city", width: 150 },
    {
      field: "repair_date",
      headerName: "Date",
      width: 100,
      renderCell: (params) => {
        if (!params.value) return ''; // Handle null or undefined values    
        const date = new Date(params.value); // Convert to Date object
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },

    { headerName: "Description", field: "fault_description", width: 180 },

    { headerName: "ACTION TAKEN", field: 'action_taken', width: 350 },
    { headerName: "Status", field: "status", width: 100 },
    { headerName: "Spare used", field: "spare_used", width: 100 },

    { headerName: "Spares Cost", field: 'cost_of_spares', width: 100 },
    {headerName: " Attended by", field: "attended_by", width: 100, },
    {headerName: "Remarks", field: "remarks", width: 100, },

  ]
  const initialColumnVisibility = {

  };

  const rows1 = equipments.map((item) => ({
    id: item.psa_id,
    ...item,
  }));
  const contextMenuItems = [
    {
      label: "Edit", action: (row) => {
        console.log(row)
        setDialogContent(
          <EditService
            id={row.id}
            onClose={handleClose}
            imageTitle={"update Image"}// Pass the close handler to the form

          />
        );
        setOpenDialogName('Edit Service')
        handleOpen()
        // console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },

    {
      label: "View Detail", action: (row) => {
        setDialogContent(
          <EquipmentDetail
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
          />
        );
        setOpenDialogName('View Detail')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    {
      label: "Upload Document", action: (row) => {

        setDialogContent(
          <Upload
            equipmentId={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
          />
        );
        setOpenDialogName('Upload Document')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    // { label: "Upload Image", action: (row) => console.log("Edit row:", row) },
    // { label: "Delete", action: (row) => console.log("Delete row:", row) },

    {
      label: "Delete", action: async (row) => {
        const confirmed = window.confirm(`Are you sure you want to delete PSA ID: ${row.id}?`);
        if (!confirmed) return;

        try {
          const res = await fetch(`/api/services/edit/${row.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const result = await res.json();

          if (res.ok) {
            alert('Deleted successfully');

            // optionally refresh table data
            await fetchEquipments();; // Replace with your own data reload function
          } else {
            alert(`Delete failed: ${result.message || result.error}`);
          }
        } catch (error) {
          console.error("Delete error:", error);
          alert("Something went wrong while deleting.");
        }
      }
    }
  ];

  const AddNewEquipment = () => {
    setDialogContent(
      <EditCMC onClose={handleClose}
        imageTitle={"Add Image"}
      />
    );
    setOpenDialogName('Add Equipment');
    handleOpen();
  };

  const exportData = rows1.map(({ id, ...rest }) => rest);
  return (
    <div style={{ padding: "5px", marginLeft: "5px", justifyContent: "center", alignItems: "center" }}>
      <h2>Repair Detail</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} style={{ padding: "10px" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
            {/* Search Box */}
            <TextField
              label="Search"
              variant="outlined"
              type="search"
              size="small"
              style={{ width: "15%" }}
              onChange={handleSearch}
            />
            {/* Buttons */}
            <Box display="flex" gap="10px">
              <ExportToExcelButton data={exportData}
                filename="exported-file" label="Export to XLS" />
              {/* <Button 
                ExportToExcelButton data={exportData} filename="products" 
                variant="outlined"
                startIcon={<ArrowUpwardOutlinedIcon />}
                
              >
                Export
              </Button> */}
              {/* <Button onClick={AddNewEquipment} variant="contained" color="secondary">
                Add CMC/AMC
              </Button> */}
            </Box>
          </Box>
          <ReusableModal
            open={isModalOpen}
            onClose={handleClose}
            title={openDialogName}
          >
            {dialogContent}
          </ReusableModal>
          <CustomDataGrid
            rows={rows1}
            columns={columnDefs}
            checkboxSelection={false}
            initialColumnVisibility={initialColumnVisibility}
            contextMenuItems={contextMenuItems}
          />
        </Paper>
      )}
    </div>
  );
}
