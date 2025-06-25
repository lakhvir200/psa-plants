"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, CircularProgress } from "@mui/material";
import CustomDataGrid from "../components/DataGrid.jsx";
import ReusableModal from "../components/DialogPopup";
import EditService from "../components/EditServiceForm.jsx";
import UploadService from "../components/EditServiceReport";
import ViewReports from "../service_report/page.js";
import ExportToExcelButton from "../components/ExportToExcelButton.jsx";

export default function CmcDetail({ id, psa_id }) {

  console.log('id from back end ', id, psa_id)
  const isFirstRender = useRef(true);

  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialogName, setOpenDialogName] = useState('');
  const [dialogContent, setDialogContent] = useState(null);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const fetchEquipments = async () => {

    try {
      const res = await fetch(`/api/cmc-report/edit/${psa_id}`);
      const data = await res.json();
      console.log('data from back end', data);
///edit/${psa_id}
      // If data is a single object (not array), wrap it
      const items = Array.isArray(data) ? data : [data];

      setEquipments(
        items.map((item, index) => ({
          ...item,
          id: item.id || item.psa_id || index, // Ensure unique ID
        }))
      );
    } catch (error) {
      console.error("Error fetching equipments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  console.log('equipment', equipments);
  const columnDefs = [
     { headerName: " ID", field: "id", width: 100 },
    { headerName: "PSA ID", field: "psa_id", width: 100 },
    {
      field: "service_date",
      headerName: "Date of Service",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-IN');
      },
    },
    { headerName: "Remarks", field: "remarks", width: 250 },
    {
      field: "file_url",
      headerName: "View",
      width: 200,
      renderCell: (params) =>
        params.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", color: "#1976d2" }}
          >
            View
          </a>
        ) : (
          <span style={{ color: "#999" }}></span> // or return null
        ),
    },

  ];

  const initialColumnVisibility = {
    rate: false,
    amount: false,
  };

  const contextMenuItems = [
    {
      label: "Add",
      action: (row) => {
        setDialogContent(
          <EditService
            id={row.id}
            psa_id={row.psa_id}
            onClose={handleClose}
            imageTitle="Update Image"
          />
        );
        setOpenDialogName("Edit Service");
        handleOpen();
      },
    },
    {
      label: "View Reports",
      action: (row) => {
        setDialogContent(
          <ViewReports psa_id={row.psa_id} onClose={handleClose} />
        );
        setOpenDialogName("View Reports");
        handleOpen();
      },
    },
    {
      label: "Upload Report",
      action: (row) => {
        setDialogContent(
          <UploadService id={row.psa_id} onClose={handleClose} />
        );
        setOpenDialogName("Upload Report");
        handleOpen();
      },
    },
    {
      label: "Delete",
      action: async (row) => {
        const confirmed = window.confirm(`Delete PSA ID: ${"47"}?`);
        if (!confirmed) return;

        try {
          const res = await fetch(`/api/cmc-report/edit/${row.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
          const result = await res.json();

          if (res.ok) {
            alert("Deleted successfully");
            fetchEquipments();
          } else {
            alert(`Delete failed: ${result.message || result.error}`);
          }
        } catch (error) {
          console.error("Delete error:", error);
          alert("Error deleting.");
        }
      },
    },
  ];

  const exportData = equipments.map(({ id, ...rest }) => rest);

  return (
    <div style={{ padding: "5px" }}>
      {/* <h2>Services Reports</h2> */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} style={{ padding: "10px" }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <ExportToExcelButton
              data={exportData}
              filename="exported-file"
              label="Export to XLS"
            />
          </Box>
          <ReusableModal
            open={isModalOpen}
            onClose={handleClose}
            title={openDialogName}
          >
            {dialogContent}
          </ReusableModal>

          <CustomDataGrid
            rows={equipments}
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
