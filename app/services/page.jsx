"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import CustomDataGrid from "../components/DataGrid.jsx";
import { Container, Typography, CircularProgress, Grid } from '@mui/material';
import { Paper, MenuItem, Select, FormControl, InputLabel, Box, Button, TextField } from "@mui/material";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ReusableModal from "../components/DialogPopup";
import EditCMC from '../components/EditCmcForm.jsx'
import EditService from '../components/EditServiceForm.jsx'
import UploadService from '../components/EditServiceReport'
import ViewReports from '../components/ServiceDetail.js';


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
      const res = await fetch("/api/services");
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

  // console.log(equipments)
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
    { headerName: "ID", field: "psa_id", width: 100 },
    { headerName: "CUSTOMER NAME", field: "customer_name", width: 220 },

    // { headerName: "STATE", field: "state", width: 120 },
    { headerName: "CITY", field: "city", width: 120 },
    { headerName: "SER_HRS", field: "service_hrs", width: 100 },


    {
      field: "serviced_on",
      headerName: "DATE OF SERVICE",
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

    { headerName: " RUN HOURS", field: "current_hrs", width: 100 },


    {
      headerName: "NEXT SERVICE DATE",
      field: "next_service_date",
      width: 100,
      renderCell: (params) => {
        const { service_hrs, serviced_on } = params.row;

        if (!service_hrs || !serviced_on) return '';

        const baseDate = new Date(serviced_on);

        // Convert hours to milliseconds
        const nextServiceDate = new Date(baseDate.getTime() + service_hrs * 60 * 60 * 1000);

        const day = String(nextServiceDate.getDate()).padStart(2, '0');
        const month = String(nextServiceDate.getMonth() + 1).padStart(2, '0');
        const year = nextServiceDate.getFullYear();

        return `${day}-${month}-${year}`;
      }
    },

    {

      headerName: "DUE IN DAYS",
      field: "days_left",
      width: 150,
      renderCell: (params) => {
        const { service_hrs, serviced_on } = params.row;
        if (!service_hrs || !serviced_on) return '';
        const serviceDays = Math.floor(service_hrs / 24);


        const baseDate = new Date(serviced_on);
        const today = new Date();

        // Clear time to ensure accurate difference
        baseDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // Get the difference in milliseconds
        const diffMs = today - baseDate;


        // Convert milliseconds to hours
        // const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));


        const diff = serviceDays - diffDays
        // console.log('dif', diff)

        if (diff > 0 && diff < 30) {
          return (
            <span style={{ color: 'orange', fontWeight: 'bold' }}>
              -{diff} days
            </span>
          );
        }

        if (diff > 0) {
          return (
            <span style={{ color: 'green', fontWeight: 'bold' }}>
              -{diff} days
            </span>
          );
        }

        if (diff < 0) {
          return (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              +{Math.abs(diff)} days overdue
            </span>
          );
        }

        return <span style={{ fontWeight: 'bold' }}>Due Today</span>;
      }
    },

    { headerName: "RATE", field: 'rate', width: 100 },
    { headerName: "AMOUNT", field: 'amount', width: 100 },
    { headerName: "REMARKS", field: 'notes', width: 250 },
    // {
    //   headerName: "ADD",
    //   field: "add_action",
    //   width: 70,
    //   renderCell: (params) => {
    //     const handleClick = () => {
    //       // You can replace this with any logic (e.g., open modal, navigate)
    //       // alert(`Add clicked for ID: ${params.row.id}`);

    //       setDialogContent(
    //         <EditService
    //           id={params.row.id}
    //           onClose={handleClose}
    //           imageTitle={"update Image"}// Pass the close handler to the form

    //         />
    //       );
    //       setOpenDialogName('Edit Service')
    //       handleOpen()
    //       // console.log("Edit row:", row.EQUIPMENT_ID)

    //     };

    //     return (
    //       <button
    //         style={{
    //           backgroundColor: '#1976d2',
    //           color: '#fff',
    //           border: 'none',
    //           borderRadius: '4px',
    //           padding: '6px 12px',
    //           cursor: 'pointer',
    //         }}
    //         onClick={handleClick}
    //       >
    //         Add
    //       </button>

    //     );
    //   }
    // },
    // {
    //   headerName: "ADD",
    //   field: "add_upload",
    //   width: 120,
    //   renderCell: (params) => {
    //     const handleClick = () => {
    //       // You can replace this with any logic (e.g., open modal, navigate)
    //       // alert(`Add clicked for ID: ${params.row.id}`);

    //       setDialogContent(
    //         <UploadService
    //           id={params.row.psa_id}
    //           onClose={handleClose}
    //           imageTitle={"update Image"}// Pass the close handler to the form

    //         />
    //       );
    //       setOpenDialogName('Edit Service')
    //       handleOpen()
    //       // console.log("Edit row:", row.EQUIPMENT_ID)

    //     };

    //     return (
    //       <button
    //         style={{
    //           backgroundColor: '#1976d2',
    //           color: '#fff',
    //           border: 'none',
    //           borderRadius: '4px',
    //           padding: '6px 12px',
    //           cursor: 'pointer',
    //         }}
    //         onClick={handleClick}
    //       >
    //         Upload
    //       </button>

    //     );
    //   }
    // },

  ]
  const initialColumnVisibility = {
    rate: false,
    amount: false,

  };

  const rows1 = equipments.map((item) => ({
    id: item.psa_id,
    ...item,
  }));
  const contextMenuItems = [
    {
      label: "Add", action: (row) => {
        console.log(row)
        setDialogContent(
          <EditService
            id={row.id}
            psa_id={row.psa_id}
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
      label: "View Reports", action: (row) => {
        setDialogContent(
          <ViewReports
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
      label: "Upload Report", action: (row) => {

        setDialogContent(
          <UploadService
            id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
          />
        );
        setOpenDialogName('Upload report')
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
      <h2>Services Detail</h2>
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
