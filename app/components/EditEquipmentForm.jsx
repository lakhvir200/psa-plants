// app/components/EditEquipmentForm.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Grid} from "@mui/material";
//import Grid from '../components/DataGrid';
import CheckBox from "../components/Checkbox";
import ReusableInput from "../components/inputField1";
import DatePickerField from "../components/Datepicker";

export default function EditEquipmentForm({ psa_id, onClose,imageTitle,insert }) {

 // console.log(psa_id,onclose)
// const { psa_id}=params
 //   const psa_id = '';
  // console.log(psa_id,imageTitle,insert)
   const [equipmentData, setEquipmentData] = useState({});
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const mandatoryFields = [
    "customer_name",
    "specification",
    "state",
    "city",
    "model",
    "service_hrs"
  ];
  // ✅ Function to check if all mandatory fields are filled
  const isFormValid = () => {
    return mandatoryFields.every((field) => {
      const value = equipmentData[field];
      return value !== undefined && value !== null && value.toString().trim() !== "";
    });
  };

   useEffect(() => {
     if (!psa_id) return;
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
 
   if (!equipmentData) return <div>Loading...</div>;
 
   const handleChangeText = (event) => {
     const { name, value } = event.target;
     setEquipmentData((prevState) => ({
       ...prevState,
       [name]: value,
     }));
   };
 
   const handleChange = (e, value, name) => {
     setEquipmentData((prev) => ({
       ...prev,
       [name || e.target.name]: value ?? e.target.value,
     }));
   };
 
   const handleChangeCheckbox = (name, value) => {
     setEquipmentData((prev) => ({
       ...prev,
       [name]: value,
     }));
   };
   console.log(equipmentData)
   const handleSubmit = (event) => {
     event.preventDefault();  
     if (insert === "Clone" || !equipmentData.psa_id  ){
       console.log("Adding new equipment:", equipmentData);
      insertEquipment(equipmentData); // Perform insert operation if cloning or psa_id is missing
     } else {
       console.log("Updating equipment:", equipmentData);
        console.log("Updating equipment:", equipmentData);
       updateEquipment(equipmentData); // Perform update if psa_id exists and not cloning
     }
   };
 
   const updateEquipment = async (data) => {
     console.log("Updating equipment in database...", data);
   
     try {
       const response = await fetch(`/api/psa/edit/${data.psa_id}`, {
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
       window.location.href = "/psa";
     } catch (error) {
       console.error("Error updating equipment:", error.message);
       alert("Failed to update data. Please try again.");
     }
   }; 
   const insertEquipment = async (data) => {
     console.log("Inserting new equipment into database...", data);
   
     try {
       const response = await fetch("/api/psa/add/", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           customer_name: data.customer_name,
           state: data.state,
           model: data.model,
           service_hrs:data.service_hrs,
           specification: data.specification,
           remarks: data.remarks,
           dateOfPurchase: data.dateOfPurchase,
           dateOfInstallation: data.dateOfInstallation,
           isActive: data.isActive,
           city: data.city,
           supplier: data.supplier,
           createdAt: new Date().toISOString(),
         }),
       });
   
       if (!response.ok) {
         throw new Error("Failed to insert equipment");
       }
   
       const result = await response.json();
       console.log("Insert successful", result);
   
       alert("Data has been added successfully!");
       window.location.href = "/psa";
     } catch (error) {
       console.error("Error inserting equipment:", error.message);
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
           <Button variant="contained" color="primary" sx={{ marginTop: 1 }}>
             {imageTitle || "Add Image"}
           </Button>
         </Grid>
 
         <Grid sx={{ width: '75%' }}>
           <Grid container spacing={2}>
             <Grid sx={{ width: '30%' }}>
               <Stack spacing={2}>
                 <ReusableInput label="Customer Name" name="customer_name" onChange={handleChangeText} inputValue={equipmentData.customer_name || ""} fullWidth />
                 <ReusableInput label="State" name="state" onChange={handleChangeText} inputValue={equipmentData.state || ""} fullWidth />
                 <ReusableInput label="Cost of equipment" name="cost" onChange={handleChangeText} inputValue={equipmentData.cost || ""} fullWidth />
               </Stack>
             </Grid>
 
             <Grid sx={{ width: '30%' }}>
               <Stack spacing={2}>
                 <ReusableInput label="City" name="city" onChange={handleChangeText} inputValue={equipmentData.city || ""} fullWidth />
                 <ReusableInput label="Model" name="model" onChange={handleChangeText} inputValue={equipmentData.model || ""} fullWidth />
                 <ReusableInput label="Service Hours" name="service_hrs" onChange={handleChangeText} inputValue={equipmentData.service_hrs || ""} fullWidth />
               </Stack>
             </Grid>
 
             <Grid sx={{ width: '30%' }}>
               <Stack spacing={2}>
               <DatePickerField label="Date of purchase" name="date_of_purchase" value={equipmentData.date_of_purchase || ""} onChange={handleChange} fullWidth />
                 <DatePickerField label="Date of Installation" name="date_of_installation" value={equipmentData.date_of_installation || ""} onChange={handleChange} fullWidth />
                 <Grid sx={{ width: '100%' }}>
               <Stack spacing={2}>
               
                 <Stack direction="row" spacing={2} alignItems="center">
                   <ReusableInput label="ID" name="psa_id"  inputValue={equipmentData.psa_id || ""} fullWidth />
                   <CheckBox name="is_active" label="Active" checked={equipmentData.is_active || false} onChange={handleChangeCheckbox} />
                   
                 </Stack>
               </Stack>
             </Grid>
               </Stack>
             </Grid>            
 
             <Grid sx={{ width: '45%' }}>
               <ReusableInput label="Specification" name="specification" onChange={handleChangeText} inputValue={equipmentData.specification || ""} multiline rows={2} fullWidth />
             </Grid>
 
             <Grid sx={{ width: '45%' }}>
               <ReusableInput label="Supplier" name="supplier" onChange={handleChangeText} inputValue={equipmentData.supplier || ""} multiline rows={2} fullWidth />
             </Grid>
 
             <Grid sx={{ width: '95%' }}>
               <ReusableInput label="Remarks" name="remarks" onChange={handleChangeText} inputValue={equipmentData.remarks || ""} multiline rows={1} fullWidth />
             </Grid>
           </Grid>
         </Grid>
 
         <Grid container justifyContent="flex-end" spacing={2} sx={{ width: '100%', marginTop: 2 }}>
           <Grid>
             <Button variant="contained" color="primary" type="submit"
              disabled={!isFormValid()}>
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

