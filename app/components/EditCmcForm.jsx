"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Grid } from "@mui/material";
import ReusableInput from "../components/inputField1";
import DatePickerField from "../components/Datepicker";

export default function EditCmcForm({ onClose, psa_id, imageTitle, action, id }) {


  console.log(onClose, psa_id, imageTitle, action, id )
  const [cmcData, setCmcData] = useState({});
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    amc_cmc: "",
    rate: "",
    amount: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --------------------------------------------------
  // 🔄 LOAD DATA FOR ADD / EDIT
  // --------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let psaData = null;
        let cmcRecord = null;

        // ADD MODE → load only PSA master data
        if (action === "add") {
          if (!psa_id) return;

          const psaRes = await fetch(`/api/psa/edit/${psa_id}`);
          if (!psaRes.ok) throw new Error("Failed to fetch PSA data");

          psaData = await psaRes.json();
          setCmcData(psaData);
        }

        // EDIT MODE → load CMC + PSA together
        if (action === "edit") {
          if (!id || !psa_id) return;

          const [cmcRes, psaRes] = await Promise.all([
            fetch(`/api/cmc/edit/${id}`),
            fetch(`/api/psa/edit/${psa_id}`),
          ]);

          if (!cmcRes.ok || !psaRes.ok)
            throw new Error("Failed to fetch data");

          cmcRecord = await cmcRes.json();
          psaData = await psaRes.json();

          const merged = { ...psaData, ...cmcRecord };
          setCmcData(merged);

          // Pre-fill formData from CMC record
          setFormData({
            start_date: cmcRecord.start_date || "",
            end_date: cmcRecord.end_date || "",
            amc_cmc: cmcRecord.amc_cmc || "",
            rate: cmcRecord.rate || "",
            amount: cmcRecord.amount || "",
            remarks: cmcRecord.remarks || "",
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [action, id, psa_id]);

  if (loading) return <div>Loading...</div>;

  // --------------------------------------------------
  // 🔧 HANDLE TEXT INPUTS
  // --------------------------------------------------
  const handleChangeText = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --------------------------------------------------
  // 📅 HANDLE DATE PICKERS + AUTO END DATE
  // --------------------------------------------------
  const handleChange = (e, value, name) => {
    const fieldName = name || e.target.name;
    const fieldValue = value ?? e.target.value;

    const updated = { ...formData, [fieldName]: fieldValue };

    // Auto-generate 1 year end date
    if (fieldName === "start_date") {
      const start = new Date(fieldValue);
      if (!isNaN(start)) {
        const end = new Date(start);
        end.setFullYear(end.getFullYear() + 1);
        end.setDate(end.getDate() - 1);

        updated.end_date = end.toISOString().split("T")[0];
      }
    }

    setFormData(updated);
  };

  // --------------------------------------------------
  // 📝 SUBMIT FORM
  // --------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      psa_id: psa_id,
      id: id,
    };

    if (action === "add") addCmc(payload);
    else updateCmc(payload);
  };

  // --------------------------------------------------
  // 🔧 UPDATE CMC
  // --------------------------------------------------
  const updateCmc = async (data) => {
    try {
      const response = await fetch(`/api/cmc/edit/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update CMC");

      alert("Data updated successfully!");
      window.location.href = "/cmc";
    } catch (error) {
      alert("Update failed. Try again.");
    }
  };

  // --------------------------------------------------
  // ➕ ADD NEW CMC
  // --------------------------------------------------
  const addCmc = async (data) => {
    try {
      const response = await fetch(`/api/cmc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add CMC");

      alert("New CMC added successfully!");
      window.location.href = "/cmc";
    } catch (error) {
      alert("Failed to add data.");
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>

        {/* IMAGE */}
        <Grid sx={{ width: "23%", display: "flex", justifyContent: "center" }}>
          <Box>
            <img
              src="/images/MENTIS.jpg"
              alt="CMC"
              width={250}
              height={250}
              style={{ border: "1px solid #ccc" }}
            />
          </Box>
        </Grid>

        {/* FORM FIELDS */}
        <Grid sx={{ width: "75%" }}>
          <Grid container spacing={2}>

            {/* LEFT */}
            <Grid sx={{ width: "45%" }}>
              <Stack spacing={2}>
                <ReusableInput
                  label="PSA ID"
                  name="psa_id"
                  inputValue={cmcData.psa_id || ""}
                  disabled
                  fullWidth
                />

                <ReusableInput
                  label="Customer Name"
                  name="customer_name"
                  inputValue={cmcData.customer_name || ""}
                  disabled
                  fullWidth
                />

                <DatePickerField
                  label="Start Date of CMC"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  fullWidth
                />

                <DatePickerField
                  label="End Date of CMC"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* RIGHT */}
            <Grid sx={{ width: "45%" }}>
              <Stack spacing={2}>
                <ReusableInput
                  label="AMC/CMC"
                  name="amc_cmc"
                  inputValue={formData.amc_cmc}
                  onChange={handleChangeText}
                  fullWidth
                />

                <ReusableInput
                  label="Rate"
                  name="rate"
                  inputValue={formData.rate}
                  onChange={handleChangeText}
                  fullWidth
                />

                <ReusableInput
                  label="Amount"
                  name="amount"
                  inputValue={formData.amount}
                  onChange={handleChangeText}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* REMARKS */}
            <Grid sx={{ width: "95%" }}>
              <ReusableInput
                label="Remarks"
                name="remarks"
                inputValue={formData.remarks}
                onChange={handleChangeText}
                multiline
                rows={2}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        {/* BUTTONS */}
        <Grid
          container
          justifyContent="flex-end"
          spacing={2}
          sx={{ width: "100%", mt: 2 }}
        >
          <Grid>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>

          <Grid>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
