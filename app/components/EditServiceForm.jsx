
"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Grid } from "@mui/material";
import ReusableModal from "../components/DialogPopup";
import CheckBox from "../components/Checkbox";
import ReusableInput from "../components/inputField1";
import DatePickerField from "../components/Datepicker";
import UploadServiceReport from "../components/EditServiceReport";

export default function EditServiceForm({ onClose, id, imageTitle, action, psa_id }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialogName, setOpenDialogName] = useState('');
  const [dialogContent, setDialogContent] = useState(null);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    current_hrs: "",
    rate: "",
    amount: "",
    serviced_on: "",
    nature_of_service: "",
    expenses: "",
    notes: ""
  });

  // -----------------------------------------------------
  // FETCH DATA FOR ADD OR EDIT
  // -----------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let psaData = null;
        let serviceData = null;

        if (action === "add") {
          if (!psa_id) return;

          const res = await fetch(`/api/psa/edit/${psa_id}`);
          psaData = await res.json();
          setData(psaData);

        } else if (action === "edit") {
          if (!id || !psa_id) return;

          const [serviceRes, psaRes] = await Promise.all([
            fetch(`/api/services/edit/${id}`),
            fetch(`/api/psa/edit/${psa_id}`)
          ]);

          if (!serviceRes.ok || !psaRes.ok)
            throw new Error("Failed to fetch data");

          serviceData = await serviceRes.json();
          psaData = await psaRes.json();

          const merged = { ...psaData, ...serviceData };
          setData(merged);

          // preload service fields into formData
          setFormData({
            current_hrs: serviceData.current_hrs || "",
            amount: serviceData.amount || "",
            rate: serviceData.rate || "",
            serviced_on: serviceData.serviced_on || "",
            nature_of_service: serviceData.nature_of_service || "",
            expenses: serviceData.expenses || "",
            notes: serviceData.notes || "",
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

  // -----------------------------------------------------
  // INPUT HANDLERS
  // -----------------------------------------------------
  const handleChangeText = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e, value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name || e.target.name]: value ?? e.target.value,
    }));
  };

  const handleChangeCheckbox = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------------------------------
  // SUBMIT HANDLER
  // -----------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    const mergedData = { ...data, ...formData };
    console.log(mergedData)

    if (action === "add") {
      add(mergedData);
    } else if (action === "edit") {
      update(mergedData);
    }
  };

  // -----------------------------------------------------
  // UPDATE DB
  // -----------------------------------------------------
  const update = async (data) => {
    try {
      const response = await fetch(`/api/services/edit/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update equipment");

      alert("Data has been updated successfully!");
      window.location.href = "/services";

    } catch (error) {
      alert("Failed to update data. Please try again.");
    }
  };

  // -----------------------------------------------------
  // ADD NEW
  // -----------------------------------------------------
  const add = async (data) => {
    try {
      const response = await fetch(`/api/services/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add new equipment");

      alert("New service record added successfully!");
      window.location.href = "/services";

    } catch (error) {
      alert("Failed to add data. Please try again.");
    }
  };

  // -----------------------------------------------------
  // OPEN UPLOAD DIALOG
  // -----------------------------------------------------
  const handleUploadClick = () => {
    setDialogContent(<UploadServiceReport id={psa_id} onClose={() => setIsModalOpen(false)} imageTitle="Update Image" />);
    setOpenDialogName("Upload Service Report");
    setIsModalOpen(true);
  };

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>

        {/* IMAGE SECTION */}
        <Grid sx={{ width: "23%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box>
            <img
              src="/images/MENTIS.jpg"
              width={250}
              height={250}
              style={{ border: "1px solid #ccc", objectFit: "cover" }}
            />
          </Box>
        </Grid>

        <ReusableModal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={openDialogName}>
          {dialogContent}
        </ReusableModal>

        {/* FORM SECTION */}
        <Grid sx={{ width: "75%" }}>
          <Grid container spacing={2}>

            {/* LEFT COLUMN */}
            <Grid sx={{ width: "25%" }}>
              <Stack spacing={2}>
                <ReusableInput label="Customer Name" name="customer_name" inputValue={data.customer_name || ""} />
                <DatePickerField label="Date of Service" name="serviced_on" value={formData.serviced_on} onChange={handleChange} />
                <ReusableInput label="Service Expenses" name="amount" onChange={handleChangeText} inputValue={formData.amount} />
              </Stack>
            </Grid>

            {/* MIDDLE COLUMN */}
            <Grid sx={{ width: "20%" }}>
              <Stack spacing={2}>
                <ReusableInput label="City" name="city" inputValue={data.city || ""} />
                <ReusableInput label="Current Hours" name="current_hrs" onChange={handleChangeText} inputValue={formData.current_hrs} />
                <ReusableInput label="Touring Expenses" name="expenses" onChange={handleChangeText} inputValue={formData.expenses} />
              </Stack>
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid sx={{ width: "20%" }}>
              <Stack spacing={2}>
                <ReusableInput label="Model" name="model" inputValue={data.model || ""} />
                <ReusableInput
                  label="Nature of Service"
                  name="nature_of_service"
                  onChange={handleChangeText}
                  inputValue={formData.nature_of_service}
                  type="select"
                  options={["Full", "Half"]} />
              </Stack>
            </Grid>
            {/* RIGHT COLUMN */}
            <Grid sx={{ width: "20%" }}>
              <Stack spacing={2}>
                <ReusableInput label="ID" name="psa_id" inputValue={data.psa_id || ""} />
                <CheckBox name="is_active" label="Active" checked={data.is_active || false} onChange={handleChangeCheckbox} />
              </Stack>
            </Grid>
            {/* FULL ROW REMARKS */}
            <Grid sx={{ width: "95%" }}>
              <ReusableInput label="Remarks" name="notes" onChange={handleChangeText} inputValue={formData.notes} multiline rows={1} />
            </Grid>
          </Grid>
          {/* BUTTONS */}
          <Grid container spacing={2} sx={{ marginTop: 2, alignItems: "center" }}>
            <Grid item>
              <Button variant="contained" onClick={handleUploadClick}>Upload Report</Button>
            </Grid>
            <Grid item sx={{ flexGrow: 1 }} />
            <Grid item>
              <Button variant="contained" type="submit" disabled={!formData.current_hrs || !formData.serviced_on}>
                Submit
              </Button>
            </Grid>

            <Grid item>
              <Button variant="outlined" color="secondary" onClick={onClose}>Close</Button>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </form>
  );
}
