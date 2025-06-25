
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Grid } from "@mui/material";
//import Grid from '../components/DataGrid';
import CheckBox from "../components/Checkbox";
import ReusableInput from "../components/inputField1";
import DatePickerField from "../components/Datepicker";
export default function EditCmcForm({ onClose, psa_id, imageTitle, action, id }) {
  console.log('action', action)
  const [equipmentData, setEquipmentData] = useState({});
  const [cmcData, setCmcData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEquipmentData = async () => {
      try {
        setLoading(true);

        const endpoint = action === "add"
          ? `/api/psa/edit/${psa_id}`
          : `/api/cmc/edit/${id}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }

        const data = await response.json();
        const { remarks, ...rest } = data;
        setCmcData(rest);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, [id, action]); // 👈 include action in dependencies


  // console.log(cmcData, equipmentData)

  if (!cmcData) return <div>Loading...</div>;

  const handleChangeText = (event) => {
    const { name, value } = event.target;
    setCmcData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // const handleChange = (e, value, name) => {
  //   setCmcData((prev) => ({
  //     ...prev,
  //     [name || e.target.name]: value ?? e.target.value,

  //   }));
  // };
  const handleChange = (e, value, name) => {
    const fieldName = name || e.target.name;
    const fieldValue = value ?? e.target.value;

    const updatedData = {
      ...cmcData,
      [fieldName]: fieldValue,
    };

    // If start_date is being changed, auto-calculate end_date
    if (fieldName === "start_date" && fieldValue) {
      const startDate = new Date(fieldValue);
      if (!isNaN(startDate)) {
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        endDate.setDate(endDate.getDate() - 1);

        updatedData["end_date"] = endDate.toISOString().split("T")[0];
      }
    }

    setCmcData(updatedData);
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
      console.log("Adding new CMC:", cmcData);
      addCmc(cmcData); // Call function to add
    } else {
      console.log("Updating CMC:", cmcData);
      updateCmc(cmcData); // Call function to update
    }
  };
  const updateCmc = async (data) => {
    console.log("Updating CMC in database...", data);
    try {
      const response = await fetch(`/api/cmc/update/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update CMC");
      }
      const result = await response.json();
      console.log("Update successful", result);

      // Show success alert
      alert("Data has been updated successfully!");
      window.location.href = "/cmc";
    } catch (error) {
      console.error("Error updating CMC:", error.message);
      alert("Failed to update data. Please try again.");
    }
  };
  const addCmc = async (cmcData) => {
    console.log("Adding new CMC to the database...", cmcData);
    try {
      const response = await fetch(`/api/cmc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cmcData),
      });
      if (!response.ok) {
        throw new Error("Failed to add new CMC");
      }
      const result = await response.json();
      console.log("Addition successful", result);
      // Show success alert
      alert("New CMC has been added successfully!");
      window.location.href = "/cmc"; // Redirect after success
    } catch (error) {
      console.error("Error adding new CMC:", error.message);
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
            <Grid sx={{ width: '45%' }}>
              <Stack spacing={2}>
                <ReusableInput label="ID" name="psa_id" inputValue={cmcData.psa_id || ""} fullWidth />
                <ReusableInput label="Customer Name" name="customer_name" inputValue={cmcData.customer_name || ""} fullWidth />
                {/* <ReusableInput label="State" name="state" inputValue={cmcData.state || ""} fullWidth /> */}
                <DatePickerField label="Start Date of CMC" name="start_date" value={cmcData.start_date || ""} onChange={handleChange} fullWidth />
                <DatePickerField label="End Date of CMC" name="end_date" value={cmcData.end_date || ""} onChange={handleChange} fullWidth />
              </Stack>
            </Grid>
            <Grid sx={{ width: '45%' }}>
              <Stack spacing={2}>
                {/* <ReusableInput label="City" name="city" inputValue={cmcData.city || ""} fullWidth /> */}
                <ReusableInput label="AMC/CMC" name="amc_cmc" onChange={handleChangeText} inputValue={cmcData.amc_cmc || ""} fullWidth />
                <ReusableInput label="Rate" name="rate" onChange={handleChangeText} inputValue={cmcData.rate || ""} fullWidth />
                <ReusableInput label="Amount" name="amount" onChange={handleChangeText} inputValue={cmcData.amount || ""} fullWidth />
              </Stack>
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


