
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Grid } from "@mui/material";
//import Grid from '../components/DataGrid';
import ReusableModal from "../components/DialogPopup";
import CheckBox from "../components/Checkbox";
import ReusableInput from "../components/inputField1";
import DatePickerField from "../components/Datepicker";
import { useRouter } from 'next/navigation';
import UploadServiceReport from '../components/EditServiceReport'

export default function EditServiceForm({ onClose, id, imageTitle, action, psa_id }) {
  const router = useRouter();

 // console.log('action', action, id, psa_id)
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



  const [equipmentData, setEquipmentData] = useState({});
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ current_hrs: "", rate: "", amount: "", serviced_on: "", });

  useEffect(() => {
    if (!id) return;

    const fetchEquipmentData = async () => {
      try {
        setLoading(true);

        const endpoint = action === "add"
          ? `/api/psa/edit/${psa_id}`
          : `/api/services/edit/${id}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }

        const data = await response.json();
        setData(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, [id, action]); // 👈 include action in dependencies


 // console.log(data)

  if (!data) return <div>Loading...</div>;

  const handleChangeText = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (e, value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name || e.target.name]: value ?? e.target.value,

    }));
  };

  const handleChangeCheckbox = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,

    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const mergedData = {
      ...data,
      ...formData,
    };

    if (action === "add") {
      console.log("Adding new Service:", mergedData);
     add(mergedData); // Call function to add
    } else {
      console.log("Updating equipment:", mergedData);
     update(mergedData); // Call function to update
    }
  };

  const update = async (data) => {
    console.log("Updating equipment Service...", data);
    console.log(data.psa_id)


    try {
      const response = await fetch(`/api/services/edit/${data.id}`, {

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
      window.location.href = "/services";
    } catch (error) {
      console.error("Error updating equipment:", error.message);
      alert("Failed to update data. Please try again.");
    }
  };


  const add = async (data) => {
    console.log("Adding new equipment to the database...", data);

    try {
      const response = await fetch(`/api/services/`, {
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
      alert("New equipment has been added successfully!");
      window.location.href = "/services"; // Redirect after success
    } catch (error) {
      console.error("Error adding new equipment:", error.message);
      alert("Failed to add data. Please try again.");
    }
  };
  // const handleUploadClick = () => {
  //   router.push('/upload/service_report');
  // };
  //console.log(id)
  const handleUploadClick = () => {
    //alert("id",id);
    //console.log(id)
    setDialogContent(
      <UploadServiceReport
        id={psa_id}
        onClose={handleClose}
        imageTitle={"Update Image"} // Optional: Adjust as needed
      />
    );
    setOpenDialogName('Upload Service Report');
    handleOpen();
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
        <ReusableModal
          open={isModalOpen}
          onClose={handleClose}
          title={openDialogName}
        >
          {dialogContent}
        </ReusableModal>

        <Grid sx={{ width: '75%' }}>
          <Grid container spacing={2}>
            <Grid sx={{ width: '30%' }}>
              <Stack spacing={2}>
                <ReusableInput label="Customer Name" name="customer_name" inputValue={data.customer_name || ""} fullWidth />
                <ReusableInput label="Model" name="model" inputValue={data.model || ""} fullWidth />
                <DatePickerField label="date of service" name="serviced_on" value={formData.serviced_on || ""} onChange={handleChange} fullWidth />

              </Stack>
            </Grid>

            <Grid sx={{ width: '30%' }}>
              <Stack spacing={2}>
                <ReusableInput label="City" name="city" inputValue={data.city || ""} fullWidth />
                <ReusableInput label="Current Hours" name="current_hrs" onChange={handleChangeText} inputValue={formData.current_hrs || ""} fullWidth />
                <ReusableInput label="Rate" name="rate" onChange={handleChangeText} inputValue={formData.rate || ""} fullWidth />

              </Stack>
            </Grid>

            <Grid sx={{ width: '30%' }}>
              <Stack spacing={2}>
                <ReusableInput label="State" name="state" inputValue={data.state || ""} fullWidth />

                <Stack direction="row" spacing={2} alignItems="center">
                  <ReusableInput label="ID" name="psa_id" inputValue={data.psa_id || ""} fullWidth />
                  <CheckBox name="is_active" label="Active" checked={data.is_active || false} onChange={handleChangeCheckbox} />
                </Stack>
                <ReusableInput label="Amount" name="amount" onChange={handleChangeText} inputValue={formData.amount || ""} fullWidth />
              </Stack>
            </Grid>
            <Grid sx={{ width: '95%' }}>
              <ReusableInput label="Remarks" name="notes" onChange={handleChangeText} inputValue={formData.notes || ""} multiline rows={1} fullWidth />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ width: '100%', marginTop: 2, alignItems: 'center' }}>
            {/* Left-aligned button */}
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleUploadClick}>

                Upload Report
              </Button>
            </Grid>

            {/* Spacer to push the next items to the right */}
            <Grid item sx={{ flexGrow: 1 }} />

            {/* Right-aligned buttons */}
            <Grid item>
              <Button variant="contained" color="primary" type="submit"
                disabled={
                  !formData.current_hrs.trim() ||
                  !formData.serviced_on.trim()
                }
              >
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Grid>



      </Grid>
    </form>

  );
};


