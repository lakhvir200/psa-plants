'use client';
import React, { useState } from "react";
import { Box, Button, Grid, Typography, Paper, Stack } from "@mui/material";
import ReusableInput from "./inputField1";
import DatePickerField from "./Datepicker";
import { useRouter } from "next/navigation"; // A

export default function UploadCMC({ onClose, id, start_date,end_date,imageTitle, action, psa_id }) {
  const router = useRouter();
  console.log('from edit cmc form',id, start_date,end_date)
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState("");
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    psa_id: id,
   start_date: start_date,
   end_date: end_date,
    remarks: ""
  });
console.log(form)
  const handleSubmit = async () => {
    if (!file) return alert("Please choose a PDF file");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("psa_id", form.psa_id);
    formData.append("start_date", form.start_date);
     formData.append("end_date", form.end_date);
    formData.append("remarks", form.remarks);
    console.log(form)

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/cmc-report", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        alert("Report uploaded successfully!");

        setFile(null);
        setFileURL("");
        setForm({ psa_id: "", start_date: null,end_date: null, remarks: "" });
        setProgress(0);
        onClose()
        //router.push("/services");
      } else {
        alert("Failed to upload.");
      }
    };

    xhr.send(formData);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf" && f.size <= 5 * 1024 * 1024) {
      setFile(f);
      setFileURL(URL.createObjectURL(f));
    } else {
      alert("Only PDF files up to 5MB allowed");
      e.target.value = null;
    }
  };
  const handleDateChange = (e, value, name) => {
    setForm((prev) => ({
      ...prev,
      [name || e.target.name]: value ?? e.target.value,

    }));
  };
  const handleChangeText = (event) => {
    const { name, value } = event.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'top',
        backgroundColor: '#f4f6f8', // optional: soft background
        px: 2,
      }}
    >
      <Grid
        container
        spacing={8}
        sx={{
          maxWidth: '900px',
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
        }}
      >
        {/* Left Side: Thumbnail Preview */}

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ height: '80%', width: '100%', p: 1 }}>
            <Typography variant="h6" mb={1} align="center">
              Preview
            </Typography>

            <Box sx={{ height: 'calc(100% - 40px)' }}>
              {fileURL ? (
                <embed
                  src={fileURL}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ borderRadius: 8 }}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    width: "100%",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="body2">No file selected</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Side: Upload Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6" align="center"> CMC Detail</Typography>
              <ReusableInput
                label="PSA ID"
                name="psa_id"
                onChange={handleChangeText}
                inputValue={form.psa_id || ''}
                fullWidth
              />
              <DatePickerField
                label="Start Date"
                name="start_date"
                value={form.start_date || ""}
                onChange={handleDateChange}
                fullWidth
              />
              <DatePickerField
                label="End Date"
                name="end_date"
                value={form.end_date || ""}
                onChange={handleDateChange}
                fullWidth
              />
              <ReusableInput
                label="Remarks"
                name="remarks"
                onChange={handleChangeText}
                inputValue={form.remarks || ''}
                fullWidth
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Upload
              </Button>
              {progress > 0 && (
                <progress value={progress} max="100" style={{ width: '100%' }}>
                  {progress}%
                </progress>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>

  );
}
