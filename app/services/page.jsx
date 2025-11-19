"use client";
import React, { useState, useEffect, useRef } from "react";
import CustomDataGrid from "../components/DataGrid.jsx";
import { Paper, Box, Button, TextField, CircularProgress } from "@mui/material";
import ReusableModal from "../components/DialogPopup";
import EditService from '../components/EditServiceForm.jsx';
import UploadService from '../components/EditServiceReport';
import ViewReports from '../components/ServiceDetail.js';
import debounce from "lodash.debounce";
import ExportToExcelButton from '../components/ExportToExcelButton.jsx';

export default function ServicePage() {

  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  //dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialogName, setOpenDialogName] = useState('');
  const [dialogContent, setDialogContent] = useState(null);

  const [columnDefs, setColumnDefs] = useState('');
  const [allEquipments, setAllEquipments] = useState([]);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleSearch = (e) => {
    if (e.target.value.length === 0 || e.target.value.length > 2)
      setSearchText(e.target.value || "");
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (Array.isArray(data)) {
        const formatted = data.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));
        setAllEquipments(formatted);
        setEquipments(formatted);
        setColumnDefs(joinedColumnDefs);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Search
  useEffect(() => {
    if (!searchText.trim()) {
      setEquipments(allEquipments);
      return;
    }

    const term = searchText.toLowerCase();

    const filtered = allEquipments.filter(item =>
      item.customer_name?.toLowerCase().includes(term) ||
      item.city?.toLowerCase().includes(term) ||
      item.state?.toLowerCase().includes(term) ||
      item.model?.toLowerCase().includes(term) ||
      item.psa_id?.toLowerCase().includes(term) ||
      item.nature_of_service?.toLowerCase().includes(term)
    );

    setEquipments(filtered);

  }, [searchText, allEquipments]);

  const joinedColumnDefs = [
    { headerName: "ID", field: "psa_id", width: 100 },
    { headerName: "CUSTOMER NAME", field: "customer_name", width: 220 },
    { headerName: "Model", field: "model", width: 100 },
    { headerName: "CITY", field: "city", width: 120 },
    { headerName: "SER_HRS", field: "service_hrs", width: 100 },

    {
      field: "serviced_on",
      headerName: "DATE OF SERVICE",
      width: 100,
      renderCell: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      }
    },
    { headerName: "Nature Of Service", field: "nature_of_service", width: 100 },
    { headerName: "RUN HOURS", field: "current_hrs", width: 100 },
    {
      headerName: "NEXT SERVICE DATE",
      field: "next_service_date",
      width: 100,
      renderCell: (params) => {
        const { service_hrs, serviced_on } = params.row;
        if (!service_hrs || !serviced_on) return '';
        const baseDate = new Date(serviced_on);
        const nextServiceDate = new Date(baseDate.getTime() + service_hrs * 3600000);
        return `${String(nextServiceDate.getDate()).padStart(2, '0')}-${String(nextServiceDate.getMonth() + 1).padStart(2, '0')}-${nextServiceDate.getFullYear()}`;
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
        baseDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - baseDate) / 86400000);
        const diff = serviceDays - diffDays;

        if (diff > 0 && diff < 30)
          return <span style={{ color: 'orange', fontWeight: 'bold' }}>-{diff} days</span>;

        if (diff > 0)
          return <span style={{ color: 'green', fontWeight: 'bold' }}>-{diff} days</span>;

        if (diff < 0)
          return <span style={{ color: 'red', fontWeight: 'bold' }}>+{Math.abs(diff)} days overdue</span>;

        return <span style={{ fontWeight: 'bold' }}>Due Today</span>;
      }
    },

    { headerName: "RATE", field: 'rate', width: 100 },
    { headerName: "AMOUNT", field: 'amount', width: 100 },
    { headerName: "REMARKS", field: 'notes', width: 250 },
  ];

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
      label: "Edit", action: (row) => {
        setDialogContent(
          <EditService
            id={row.id}
            psa_id={row.psa_id}
            onClose={handleClose}
            action={'edit'}
          />
        );
        setOpenDialogName('Edit Service');
        handleOpen();
      }
    },
    {
      label: "Update", action: (row) => {
        setDialogContent(
          <EditService
            id={row.id}
            psa_id={row.psa_id}
            onClose={handleClose}
            action={'add'}
          />
        );
        setOpenDialogName('Update Service');
        handleOpen();
      }
    },
    {
      label: "View Reports", action: (row) => {
        setDialogContent(
          <ViewReports psa_id={row.psa_id} onClose={handleClose} />
        );
        setOpenDialogName('View Reports');
        handleOpen();
      }
    },
    {
      label: "Upload Report", action: (row) => {
        setDialogContent(
          <UploadService id={row.psa_id} onClose={handleClose} />
        );
        setOpenDialogName('Upload report');
        handleOpen();
      }
    },
    {
      label: "Delete", action: async (row) => {
        const confirmed = window.confirm(`Are you sure you want to delete PSA ID: ${row.id}?`);
        if (!confirmed) return;

        try {
          const res = await fetch(`/api/services/edit/${row.id}`, {
            method: 'DELETE',
          });

          const result = await res.json();

          if (res.ok) {
            alert('Deleted successfully');
            await fetchServices();
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

  const ViewAllServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services/all-records");
      const data = await res.json();
      if (Array.isArray(data)) {
        const formatted = data.map((item, index) => ({
          id: item.id || index,
          ...item,
        }));
        setAllEquipments(formatted);
        setEquipments(formatted);
        setColumnDefs(recordOnlyColumnDefs);
      }
    } finally {
      setLoading(false);
    }
  };

  const recordOnlyColumnDefs = joinedColumnDefs.filter(
    col => col.field !== "next_service_date" && col.field !== "days_left"
  );

  const exportData = rows1.map(({ id, ...rest }) => rest);

  return (
    <div style={{ marginLeft: "5px" }}>
      <h2>Services Detail</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} style={{ padding: "10px" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              style={{ width: "15%" }}
              onChange={handleSearch}
            />

            <Box display="flex" gap="10px">
              <Button onClick={ViewAllServices} variant="contained" color="secondary">
                All services
              </Button>

              <Button onClick={fetchServices} variant="contained" color="secondary">
                Due Services
              </Button>

              <ExportToExcelButton data={exportData} filename="exported-file" label="Export to XLS" />
            </Box>
          </Box>

          <ReusableModal open={isModalOpen} onClose={handleClose} title={openDialogName}>
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
