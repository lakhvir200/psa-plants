"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import CustomDataGrid from "../../../components/DataGrid";
import { Container, Typography, CircularProgress } from '@mui/material';
import { Paper, MenuItem, Select, FormControl, InputLabel, Box, Button, TextField } from "@mui/material";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ReusableModal from "../../components/DialogPopup";
import EditEquipment from '../edit/[psa_id]/page';
import EquipmentDetail from '../detail/[psa_id]/page.js';
import AddCMC from '../../cmc_amc/edit/[psa_id]/page.js';
import { fetchHospitalData, fetchSearchEquipments, fetchSearchHospitalData } from '../../../util/api';
import debounce from "lodash.debounce";

export default function EquipmentPage() { 
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
  // console.log(searchText)
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
    { headerName: "ID", field: "psa_id", width: 80 },
    { headerName: "CUSTOMER NAME", field: "customer_name", width: 250 },

    { headerName: "MODEL", field: "model", width: 100 }, {
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

    { headerName: "STATE", field: "state", width: 100 },
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
  };
  const rows1 = equipments.map((item) => ({
    id: item.psa_id,
    ...item,
  }));
  const contextMenuItems = [
    {
      label: "Edit", action: (row) => {
        setDialogContent(
          <EditEquipment
            psa_id={row.psa_id}
            onClose={handleClose}
            imageTitle={"update Image"}// Pass the close handler to the form
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
          <EditEquipment
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
      label: "Add CMC", action: (row) => {
        setDialogContent(
          <AddCMC
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
          />
        );
        setOpenDialogName('Add CMC')
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
  
  const AddNewEquipment = () => {
    setDialogContent(
      <EditEquipment onClose={handleClose}
        imageTitle={"Add Image"}
      />
    );
    setOpenDialogName('Add Equipment');
    handleOpen();
  };
  return (
    <div style={{ padding: "5px", marginLeft: "5px", justifyContent: "center", alignItems: "center" }}>
      <h3>Equipment List</h3>
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
              <Button onClick={handleOpen}
                variant="outlined"
                startIcon={<ArrowUpwardOutlinedIcon />}
              >
                Export
              </Button>
              <Button onClick={AddNewEquipment} variant="contained" color="secondary">
                Add Equipment
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
    </div>
  );
}
