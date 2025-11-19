"use client";

import React, { useState, useEffect, useRef } from "react";
import {  CircularProgress, Paper, Box,Button,TextField} from "@mui/material";
import CustomDataGrid from "../components/DataGrid.jsx";
import ReusableModal from "../components/DialogPopup";
import UploadCMC from "../components/UploadCmc.js";
import EditCmcForm from "../components/EditCmcForm.jsx";
import CmcDetail from "../components/CmcDetail.js";
import ExportToExcelButton from "../components/ExportToExcelButton.jsx";

export default function CMCtPage() {

  const [equipments, setEquipments] = useState([]);
  const [allEquipments, setAllEquipments] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialogName, setOpenDialogName] = useState("");
  const [dialogContent, setDialogContent] = useState(null);

  // ------------------- SEARCH HANDLER -------------------
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  // ------------------- INITIAL FETCH -------------------
  const fetchEquipments = async () => {
    try {
      const res = await fetch("/api/cmc");
      const data = await res.json();

      if (Array.isArray(data)) {
        const formatted = data.map((item, i) => ({
          id: item.id || i,
          ...item,
        }));

        setAllEquipments(formatted);
        setEquipments(formatted);
        setColumnDefs(joinedColumnDefs);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  // ------------------- CLIENT-SIDE SEARCH -------------------
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
      String(item.psa_id)?.toLowerCase().includes(term)
    );

    setEquipments(filtered);
  }, [searchText, allEquipments]);

  // ------------------- COLUMN DEFINITIONS -------------------
  const joinedColumnDefs = [
    { headerName: "ID", field: "psa_id", width: 70 },
    { headerName: "CUSTOMER NAME", field: "customer_name", width: 250 },
    { headerName: "MODEL", field: "model", width: 100 },
    { headerName: "STATE", field: "state", width: 150 },
    { headerName: "CITY", field: "city", width: 150 },
    { headerName: "AMC_CMC", field: "amc_cmc", width: 80 },

    {
      headerName: "START DATE",
      field: "start_date",
      width: 100,
      renderCell: ({ value }) => formatDate(value)
    },
    {
      headerName: "END DATE",
      field: "end_date",
      width: 100,
      renderCell: ({ value }) => formatDate(value)
    },

    { headerName: "RATE", field: "rate", width: 100 },
    { headerName: "AMOUNT", field: "amount", width: 100 },

    {
      headerName: "DUE IN DAYS",
      field: "days_left",
      width: 150,
      renderCell: renderDueDays
    },

    { headerName: "REMARKS", field: "remarks", width: 200 }
  ];

  const recordOnlyColumnDefs = joinedColumnDefs.filter(
    (col) => col.field !== "days_left"
  );

  const initialColumnVisibility = {
    rate: false,
    amount: false,
  };

  // ------------------- DATE FORMAT -------------------
  function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  }

  function renderDueDays(params) {
    const { end_date } = params.row;
    if (!end_date)
      return <span style={{ color: "red", fontWeight: "bold" }}>0</span>;

    const end = new Date(end_date);
    const today = new Date();
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = Math.floor((end - today) / 86400000);

    if (diff > 0 && diff < 30)
      return <span style={{ color: "orange", fontWeight: "bold" }}>-{diff} days</span>;

    if (diff > 0)
      return <span style={{ color: "green", fontWeight: "bold" }}>-{diff} days</span>;

    if (diff < 0)
      return <span style={{ color: "red", fontWeight: "bold" }}>+{Math.abs(diff)} days overdue</span>;

    return <span style={{ fontWeight: "bold" }}>Due Today</span>;
  }

  // ------------------- CONTEXT MENU -------------------
  const contextMenuItems = [
    {
      label: "Edit",
      action: (row) => {
        setDialogContent(
          <EditCmcForm id={row.id} psa_id={row.psa_id} action="edit" onClose={handleClose} />
        );
        setOpenDialogName("Edit CMC");
        handleOpen();
      }
    },
    {
      label: "Add Renewal",
      action: (row) => {
        setDialogContent(
          <EditCmcForm id={row.id} psa_id={row.psa_id} action="add" onClose={handleClose} />
        );
        setOpenDialogName("Renew CMC");
        handleOpen();
      }
    },
    {
      label: "View Document",
      action: (row) => {
        setDialogContent(<CmcDetail id={row.id} psa_id={row.psa_id} onClose={handleClose} />);
        setOpenDialogName("CMC Records");
        handleOpen();
      }
    },
    {
      label: "Upload CMC Document",
      action: (row) => {
        setDialogContent(
          <UploadCMC id={row.psa_id} start_date={row.start_date} end_date={row.end_date} onClose={handleClose} />
        );
        setOpenDialogName("Upload CMC Document");
        handleOpen();
      }
    },
    {
      label: "Delete",
      action: async (row) => {
        const ok = window.confirm(`Delete PSA ID: ${row.id}?`);
        if (!ok) return;

        try {
          const res = await fetch(`/api/cmc/edit/${row.id}`, { method: "DELETE" });
          if (res.ok) {
            alert("Deleted");
            fetchEquipments();
          } else {
            alert("Delete failed");
          }
        } catch {
          alert("Error deleting");
        }
      }
    }
  ];

  // ------------------- VIEW FILTERS -------------------
  const ViewAllCMC = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cmc/all-records");
      const data = await res.json();

      const formatted = data.map((x, i) => ({ id: x.id || i, ...x }));
      setAllEquipments(formatted);
      setEquipments(formatted);
      setColumnDefs(recordOnlyColumnDefs);
    } finally {
      setLoading(false);
    }
  };

  const fetchCMC = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cmc");
      const data = await res.json();

      const formatted = data.map((x, i) => ({ id: x.id || i, ...x }));
      setAllEquipments(formatted);
      setEquipments(formatted);
      setColumnDefs(joinedColumnDefs);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- EXPORT -------------------
  const exportData = equipments.map(({ id, ...rest }) => rest);

  // ------------------- UI -------------------
  return (
    <div style={{ padding: "5px", marginLeft: "5px" }}>
      <h3>CMC Detail</h3>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} style={{ padding: "10px" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="10px">
            
            <TextField
              label="Search"
              variant="outlined"
              type="search"
              size="small"
              style={{ width: "15%" }}
              onChange={handleSearch}
            />

            <Box display="flex" gap="10px">
              <Button variant="contained" color="secondary" onClick={ViewAllCMC}>
                All CMC
              </Button>

              <Button variant="contained" color="secondary" onClick={fetchCMC}>
                Due CMC
              </Button>

              <ExportToExcelButton data={exportData} filename="cmc-records" label="Export to XLS" />
            </Box>
          </Box>

          <ReusableModal open={isModalOpen} onClose={handleClose} title={openDialogName}>
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

  function handleOpen() {
    setIsModalOpen(true);
  }
  function handleClose() {
    setIsModalOpen(false);
  }
}
