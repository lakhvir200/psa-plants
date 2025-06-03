
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Grid } from "@mui/material";
//import Grid from '../components/DataGrid';
import CheckBox from "../components/Checkbox";
import ReusableInput from "../components/inputField1";
import DatePickerField from "../components/Datepicker";
export default function EditCmcForm({ onClose, psa_id, imageTitle, action }) {
  console.log('action', action)
  const [equipmentData, setEquipmentData] = useState({});
  const [cmcData, setCmcData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!psa_id) return;

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);

      const endpoint = action === "add"
        ? `/api/psa/edit/${psa_id}`
        : `/api/cmc/edit/${psa_id}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to fetch equipment data");
      }

      const data = await response.json();
      setCmcData(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchEquipmentData();
}, [psa_id, action]); // 👈 include action in dependencies


 // console.log(cmcData, equipmentData)

  if (!cmcData) return <div>Loading...</div>;

  const handleChangeText = (event) => {
    const { name, value } = event.target;
    setCmcData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (e, value, name) => {
    setCmcData((prev) => ({
      ...prev,
      [name || e.target.name]: value ?? e.target.value,

    }));
  };

  const handleChangeCheckbox = (name, value) => {
    setCmcData((prev) => ({
      ...prev,
      [name]: value,

    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (action === "add") {
      console.log("Adding new equipment:", cmcData);
      addCmc(cmcData); // Call function to add
    } else {
      console.log("Updating equipment:", cmcData);
      updateCmc(cmcData); // Call function to update
    }
  };

  const updateCmc = async (data) => {
    console.log("Updating equipment in database...", data);

    try {
      const response = await fetch(`/api/cmc/edit/${data.psa_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update equipment");
      }

      const result = await response.json();
      console.log("Update successful", result);

      // Show success alert
      alert("Data has been updated successfully!");
      window.location.href = "/cmc";
    } catch (error) {
      console.error("Error updating equipment:", error.message);
      alert("Failed to update data. Please try again.");
    }
  };


  const addCmc = async (cmcData) => {
    console.log("Adding new equipment to the database...", cmcData);

    try {
      const response = await fetch(`/api/cmc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cmcData),
      });

      if (!response.ok) {
        throw new Error("Failed to add new equipment");
      }

      const result = await response.json();
      console.log("Addition successful", result);

      // Show success alert
      alert("New equipment has been added successfully!");
      window.location.href = "/cmc"; // Redirect after success
    } catch (error) {
      console.error("Error adding new equipment:", error.message);
      alert("Failed to add data. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} sx={{ display: 'flex' }}>
        <Grid sx={{ width: "23%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box>
            <img
              src="/images/MENTIS.jpg"
              alt={equipmentData.model}
              width={250}
              height={250}
              style={{ border: "1px solid #ccc", objectFit: "cover" }}
            />
          </Box>
          {/* <Button variant="contained" color="primary" sx={{ marginTop: 1 }}>
            {imageTitle || "Add Image"}
          </Button> */}
        </Grid>

        <Grid sx={{ width: '75%' }}>
          <Grid container spacing={2}>
            <Grid sx={{ width: '30%' }}>
              <Stack spacing={2}>
                <ReusableInput label="Customer Name" name="customer_name" inputValue={cmcData.customer_name || ""} fullWidth />
                <ReusableInput label="State" name="state" inputValue={cmcData.state || ""} fullWidth />
                <ReusableInput label="Rate" name="rate" onChange={handleChangeText} inputValue={cmcData.rate || ""} fullWidth />
              </Stack>
            </Grid>

            <Grid sx={{ width: '30%' }}>
              <Stack spacing={2}>
                <ReusableInput label="City" name="city" inputValue={cmcData.city || ""} fullWidth />
                <ReusableInput label="AMC/CMC" name="amc_cmc" onChange={handleChangeText} inputValue={cmcData.amc_cmc || ""} fullWidth />

                <ReusableInput label="Amount" name="amount" onChange={handleChangeText} inputValue={cmcData.amount || ""} fullWidth />
              </Stack>
            </Grid>

            <Grid sx={{ width: '30%' }}>
              <Stack spacing={2}>
                <DatePickerField label="Start Date of CMC" name="start_date" value={cmcData.start_date || ""} onChange={handleChange} fullWidth />
                <DatePickerField label="End Date of CMC" name="end_date" value={cmcData.end_date || ""} onChange={handleChange} fullWidth />
                <Stack direction="row" spacing={2} alignItems="center">
                  <ReusableInput label="ID" name="psa_id" inputValue={cmcData.psa_id || ""} fullWidth />
                  <CheckBox name="is_active" label="Active" checked={cmcData.is_active || false} onChange={handleChangeCheckbox} />

                </Stack>
              </Stack>
            </Grid>
            
            <Grid sx={{ width: '45%' }}>
              <ReusableInput label="Specification" name="specification" inputValue={cmcData.specification || ""} multiline rows={2} fullWidth />
            </Grid>

            <Grid sx={{ width: '45%' }}>
              <ReusableInput label="Supplier" name="supplier" inputValue={cmcData.supplier || ""} multiline rows={2} fullWidth />
            </Grid>

            <Grid sx={{ width: '95%' }}>
              <ReusableInput label="Remarks" name="remarks" onChange={handleChangeText} inputValue={cmcData.remarks || ""} multiline rows={1} fullWidth />
            </Grid>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" spacing={2} sx={{ width: '100%', marginTop: 2 }}>
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
};


