'use client';

// import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
//import Grid from '../components/DataGrid';
import { Box, TextField, Typography, Paper, Button, Stack, Grid } from "@mui/material";
import ReusableInput from "../components/InputField";
import CheckBox from "../components/Checkbox";
import CustomDataGrid from "../components/DataGrid";
export default function EquipmentDetail({ psa_id, onClose,imageTitle }) {
  //   const router = useRouter();
  //   const { psa_id } = router.query;
  console.log(psa_id,imageTitle)
  const [equipmentData, setEquipmentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(psa_id)
  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/psa/edit/${psa_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch equipment data");
        }
        const data = await response.json();
        setEquipmentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, [psa_id]);
 // console.log(equipmentData)
  if (!equipmentData) return <div>Loading...</div>;

  return (

    <Grid container spacing={2} sx={{ display: 'flex' }}>
      {/* Image Section */}
      <Grid sx={{ width: "12%", display: "flex", flexDirection: "column", alignItems: "left" }}>
        <Box>
          <img
            src="/images/MENTIS.jpg"
            alt={equipmentData.model}
            width={150}
            height={150}
            style={{ border: "1px solid #ccc", objectFit: "cover" }} // Optional styling
          />
        </Box>
      </Grid>

      {/* Input Fields Section */}
      <Grid  sx={{ width: '75%' }}>
        <Paper sx={{ padding: 1 }}>
          <Grid container spacing={2}>
            {/* First Column */}
            <Grid  sx={{ width: '30%' }}>
              <Stack spacing={1}>
                <Typography variant="body1"><strong>Customer Name:</strong> {equipmentData.customer_name}</Typography>
                <Typography variant="body1"><strong>State:</strong> {equipmentData.state}</Typography>                     
                
              </Stack>
            </Grid>

            {/* Second Column */}
            <Grid  sx={{ width: '30%' }}>
              <Stack spacing={1}>
              <Typography variant="body1"><strong>City:</strong> {equipmentData.city}</Typography>  
              <Typography variant="body1"><strong>Model:</strong> {equipmentData.model}</Typography>
                
                            
              </Stack>
            </Grid>

            {/* Third Column */}
            <Grid  sx={{ width: '30%' }}>
              <Stack spacing={1}>
              <Typography variant="body1">
                  <strong>Date of Installation:</strong> {new Date(equipmentData.date_of_installation).toLocaleDateString('en-GB')}
                </Typography>   
                {/* <CheckBox name="ISACTIVE" label="Active" value={equipmentData.isactive} /> */}
                <Typography variant="body1">
                  <strong>ID:</strong> {equipmentData.psa_id}
                </Typography>   
              </Stack>
            </Grid>

            {/* Additional Fields */}
            <Grid  sx={{ width: '45%' }}>
              <Typography variant="body1"><strong>Specification:</strong> {equipmentData.specification}</Typography>
            </Grid>
            
            <Grid  sx={{ width: '45%' }}>
              <Typography variant="body1"><strong>Remarks:</strong> {equipmentData.remarks}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Sidebar and Placeholder Section */}
      <Grid container spacing={2} sx={{ width: '100%', }}>
        <Grid  sx={{ width: '10%' }}>
          <Paper sx={{ height: '150%', padding: 2 }}>
            <Stack spacing={1}>
              <Button variant="contained">Repair</Button>
              <Button variant="contained">Maint</Button>
              <Button variant="contained">Calibration</Button>
              <Button variant="contained">Documents</Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid  sx={{ width: '86%' }}>
          <Paper sx={{ height: '150%', padding: 2, width: '100%' }}>
            <Typography variant="h1">This space is for Data Grid</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      {/* <Grid container justifyContent="flex-end" spacing={2} sx={{ width: '100%', marginTop: 2 }}>
        <Grid item>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Close
          </Button>
        </Grid>
      </Grid> */}
    </Grid>





  );
}
