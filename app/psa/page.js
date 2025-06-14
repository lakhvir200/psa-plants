"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import CustomDataGrid from "../components/DataGrid.jsx";
import { Container, Typography, CircularProgress } from '@mui/material';
import { Paper, MenuItem, Select, FormControl, InputLabel, Box, Button, TextField } from "@mui/material";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ReusableModal from "../components/DialogPopup.jsx";
import { fetchHospitalData, fetchSearchEquipments, fetchSearchHospitalData } from '../util/api.js';
import AddEquipment from '../psa/add/page.js'
import EditEquipment from '../psa/edit/[psa_id]/page.js'
import EditEquipmentForm from '../components/EditEquipmentForm.jsx';
import EditCmcForm from '../components/EditCmcForm.jsx';
import EditServiceForm from '../components/EditServiceForm.jsx';
import DetailEquipmentForm from '../components/DetailEquipmentForm.jsx';
import ExportToExcelButton from '../components/ExportToExcelButton.jsx';

import debounce from "lodash.debounce";
import Link from 'next/link';
import EquipmentDetail from "../components/DetailEquipmentForm.jsx";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [openDialogName, setOpenDialogName] = useState('');



  const isFirstRender = useRef(true);
  // Filter states 
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const res = await fetch("/api/psa"); // fetches from your API route
  //       if (!res.ok) {
  //         throw new Error("Failed to fetch");
  //       }
  //       const json = await res.json();
  //       setData(json);
  //     } catch (err) {
  //       setError(err.message || "Error occurred");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const result = await fetchHospitalData();
        const parsedData = JSON.parse(result);
        setEquipments(parsedData.equip);
      } catch (error) {
        console.error("Error fetching equipments:", error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchEquipments();
  }, []);

  const rows1 = equipments.map((item) => ({
    id: item.psa_id,
    ...item,
  }));
   //console.log(rows1)
  const columnDefs = [
    { headerName: "ID", field: "psa_id", width: 150 },
    { headerName: "CUSTOMER NAME", field: "customer_name", width: 250 },

    { headerName: "MODEL", field: "model", width: 140 }, {
      headerName: "SPECIFICATION", field: "specification", minWidth: 300,
    },
    {
      field: "date_of_purchase",
      headerName: "DTAE OF PURCHASE",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return ''; // Handle null or undefined values    
        const date = new Date(params.value); // Convert to Date object
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    { headerName: "Cost", field: "cost", width: 150 },
     { headerName: "SERVICE HOURS", field: "service_hrs", width: 150 },
    { headerName: "STATE", field: "state", width: 150 },
    { headerName: "CITY", field: 'city', width: 150 },

    {
      field: "date_of_installation",
      headerName: "DATE OF INSTALLATION",
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
    { headerName: "Remarks", field: "remarks", width: 100 },
    { headerName: "ISACTIVE", field: 'is_active', width: 75 },
    { headerName: "Supplier", field: 'supplier', width: 150 },
  ]
  const initialColumnVisibility = {
    date_of_purchase: false,
    cost:false,
    service_hrs: false
  };
  const contextMenuItems = [
    {
      label: "Edit", action: (row) => {
       // console.log(row)
        setDialogContent(
          <EditEquipmentForm
            psa_id={row.psa_id}
            onClose={handleClose}
            imageTitle={"update Image"}// Pass the close handler to the form
            insert={"Edit"}
          />
        );
        setOpenDialogName('Edit Equipment')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    {
      label: "Clone", action: (row) => {
        setDialogContent(
          <EditEquipmentForm
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
            imageTitle={"update Image"}
            insert={"Clone"}
          />
        );
        setOpenDialogName('Clone Equipment')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    {
      label: "Add CMC", action: (row) => {
        console.log("Edit row:", row)
        setDialogContent(
          <EditCmcForm
            id={row.id}
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
            action={'add'}
          />
        );
        setOpenDialogName('Add CMC')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
         }
    
    },
    {
      label: "Add Repair", action: (row) => {
        console.log("Edit row:", row)
        setDialogContent(
          <EditCmcForm
            id={row.id}
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
            action={'add'}
          />
        );
        setOpenDialogName('Add CMC')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
         }
    
    },
    {
      label: "Add Service", action: (row) => {
        console.log("Edit row:", row)
        setDialogContent(
          <EditServiceForm
            id={row.id}
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
            action={'add'}
          />
        );
        setOpenDialogName('Add Service')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
         }
    
    },
    {
      label: "View Detail", action: (row) => {
        setDialogContent(
          <DetailEquipmentForm
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
    { label: "Upload Image", action: (row) => console.log("Edit row:", row) },
    { label: "Delete", action: (row) => console.log("Delete row:", row) },
  ];
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
  const handleSearch = (e) => {
    if (e.target.value.length === 0 || e.target.value.length > 2)
      setSearchText(e.target.value || "");
  }
  const handleOpen = () => {
    setIsModalOpen(true);
    //console.log("Opening modal...");
  };
  const handleClose = () => {
    setIsModalOpen(false);
    // console.log("closing modal...");
  }

  // console.log(equipments)
  
 const AddNewEquipment = () => {
  // Avoid putting this directly in render!
  setDialogContent(
    <EditEquipmentForm
      psa_id={""}
      insert="insert"
      onClose={handleClose}
    />
  );
  setOpenDialogName('Add Equipment');
   handleOpen()
};


  if (loading) return <p>Loading data...</p>;
  //if (error) return <p>Error: {error}</p>;
  //if (!equipments.length) return <p>No data found.</p>;

  //export to xls
  const exportData = rows1.map(({ id, ...rest }) => rest);

  return (
    <Box
      sx={{
        p: 1,
        ml: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3>Equipment List</h3>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            width: "100%",          // always take the full row
            maxWidth: { xs: "100%", md: "none" }  // no cap from md (960 px) upward
          }}
        >

          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            mb={2}
            gap={2}
          >
            {/* Search Box */}
            <TextField
              label="Search"
              variant="outlined"
              type="search"
              size="small"
              sx={{ width: { xs: "100%", sm: "25%" } }}
              onChange={handleSearch}
            />

            {/* Buttons */}
            <Box display="flex" gap={2} flexWrap="wrap" justifyContent="flex-end">
              <ExportToExcelButton data={exportData}              
              filename="exported-file" label="Export to XLS" />
              <Button
                onClick={() => AddNewEquipment()}  // ← only runs when clicked
                variant="contained"
                color="primary"
              >
                Add
              </Button>
              
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
    </Box>
  );

}
