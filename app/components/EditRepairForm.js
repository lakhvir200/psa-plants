
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Grid } from "@mui/material";
//import Grid from '../components/DataGrid';
import CheckBox from "../components/Checkbox";
import ReusableInput from "../components/inputField1";
import DatePickerField from "../components/Datepicker";

export default function EditRepairForm({ onClose, id, imageTitle, action, psa_id }) {
//  console.log('action', action, id, psa_id)
  const [equipmentData, setEquipmentData] = useState({});
  const [repairData, setRepairData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEquipmentData = async () => {
      try {
        setLoading(true);

        const endpoint = action === "add"
          ? `/api/psa/edit/${psa_id}`
          : action === "edit"
            ? `/api/repair/edit/${id}`
            : "";

        const response = await fetch(endpoint);


        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }


        const data = await response.json();
        const { remarks, ...rest } = data;
       // console.log(rest)
        setRepairData(rest);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, [id, action]); // 👈 include action in dependencies


//  console.log(repairData)

  if (!repairData) return <div>Loading...</div>;

  const handleChangeText = (event) => {
    const { name, value } = event.target;
    setRepairData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (e, value, name) => {
    setRepairData((prev) => ({
      ...prev,
      [name || e.target.name]: value ?? e.target.value,

    }));
  };

  const handleChangeCheckbox = (name, value) => {
    setRepairData((prev) => ({
      ...prev,
      [name]: value,

    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (action === "add") {
      console.log("Adding new equipment:", repairData);
      add(repairData); // Call function to add
    } else {
      console.log("Updating equipment:", repairData);
        
      update(repairData); // Call function to update
    }
  };

  const update = async (data) => {
    console.log("Updating Repair in database...", repairData);
    console.log(data.psa_id)


    try {
      console.log( 'id',id)
      const response = await fetch(`/api/repair/edit/${id}`, {

        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update Repair");
      }

      const result = await response.json();
      console.log("Update successful", result);

      // Show success alert
      alert("Repair has been updated successfully!");
      window.location.href = "/repair";
    } catch (error) {
      console.error("Error updating Repair:", error.message);
      alert("Failed to update data. Please try again.");
    }
  };


  const add = async (data) => {
    console.log("Adding Repair to the database...", data);

    try {
      const response = await fetch(`/api/repair`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add new equipment");
      }

      const result = await response.json();
      console.log("Addition successful", result);

      // Show success alert
      alert("Repair has been added successfully!");
      window.location.href = "/repair"; // Redirect after success
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
                <ReusableInput label="PSA ID" name="psa_id" inputValue={repairData.psa_id || ""} fullWidth />
                <DatePickerField label="Date of Repair" name="repair_date" value={repairData.repair_date || ""} onChange={handleChange} fullWidth />
                <ReusableInput label="Fault Description" name="fault_description" onChange={handleChangeText} inputValue={repairData.fault_description || ""} fullWidth />
                {/* <ReusableInput label="Model" name="model" inputValue={repairData.model || ""} fullWidth /> */}


              </Stack>
            </Grid>

            <Grid sx={{ width: '30%' }}>
              <Stack spacing={2}>
                <ReusableInput label=" Status" name="status" onChange={handleChangeText} inputValue={repairData.status || ""} fullWidth />

                <ReusableInput label=" Spare Used" name="spare_used" onChange={handleChangeText} inputValue={repairData.spare_used || ""} fullWidth />
                <ReusableInput label="cost of spares" name="cost_of_spares" onChange={handleChangeText} inputValue={repairData.cost_of_spares || ""} fullWidth />
              </Stack>
            </Grid>

            <Grid sx={{ width: '30%' }}>
              <Stack spacing={2}>
                {/* <ReusableInput label="State" name="state" inputValue={repairData.state || ""} fullWidth /> */}

                <ReusableInput label=" Attended By" name="attended_by" onChange={handleChangeText} inputValue={repairData.attended_by || ""} fullWidth />
                {/* <ReusableInput label=" Action Taken" name=" action_taken" onChange={handleChangeText} inputValue={repairData.action_taken || ""} fullWidth />
                <ReusableInput label=" Action Taken" name=" action_taken" onChange={handleChangeText} inputValue={repairData.action_taken || ""} fullWidth /> */}


              </Stack>


            </Grid>



            <Grid sx={{ width: '95%' }}>
              <Stack spacing={2}>
                <ReusableInput label="Action Taken" name="action_taken" onChange={handleChangeText} inputValue={repairData.action_taken || ""} multiline rows={2} fullWidth />
                <ReusableInput label="Remarks" name="remarks" onChange={handleChangeText} inputValue={repairData.remarks || ""} multiline rows={1} fullWidth />

              </Stack>
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


