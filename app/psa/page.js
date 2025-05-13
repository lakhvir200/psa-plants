"use client";

import { useEffect, useState } from "react";
import CustomDataGrid from "../components/DataGrid";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/psa"); // fetches from your API route
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const rows1 = data.map((item) => ({
    id: item.psa_id,
    ...item,
  }));
   const columnDefs = [
    { headerName: "ID", field: "psa_id", width: 150 },
    { headerName: "CUSTOMER NAME", field: "customer_name", width: 250 },

    { headerName: "MODEL", field: "model", width: 140 }, {
      headerName: "SPECIFICATION", field: "specification", minWidth: 300,
    },
    {
      field: "date_of_purchase",
      headerName: "DTAE OF PURCHASE",
      width: 150,
      renderCell: (params) => {
        if (!params.value) return ''; // Handle null or undefined values    
        const date = new Date(params.value); // Convert to Date object
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },

    { headerName: "STATE", field: "state", width: 150 },
    { headerName: "CITY", field: 'city', width: 150 },
    
    {
      field: "date_of_installation",
      headerName: "DATE OF INSTALLATION",
      width: 100,
      renderCell: (params) => {
        if (!params.value) return ''; // Handle null or undefined values    
        const date = new Date(params.value); // Convert to Date object
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    { headerName: "Remarks", field: "remarks", width: 100 },
    { headerName: "ISACTIVE", field: 'is_active', width: 75 },
    { headerName: "Supplier", field: 'supplier', width: 150 },
  ]
  const initialColumnVisibility = {
    date_of_purchase: false, 
  };
   const contextMenuItems = [
    {
      label: "Edit", action: (row) => {
        console.log(row)
        setDialogContent(
          <EditEquipment
            psa_id={row.psa_id}
            onClose={handleClose}
            imageTitle={"update Image"}// Pass the close handler to the form
          />
        );
        setOpenDialogName('Edit Equipment')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    {
      label: "Clone", action: (row) => {
        setDialogContent(
          <EditEquipment
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
            imageTitle={"update Image"}
            insert={"Clone"}
          />
        );
        setOpenDialogName('Clone Equipment')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    {
      label: "Add CMC", action: (row) => {
        console.log("Edit row:", row)
        setDialogContent(
          <AddCMC
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
            action={'add'}
          />
        );
        setOpenDialogName('Add CMC')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    {
      label: "View Detail", action: (row) => {
        setDialogContent(
          <EquipmentDetail
            psa_id={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
          />
        );
        setOpenDialogName('View Detail')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    {
      label: "Upload Document", action: (row) => {
        setDialogContent(
          <Upload
            equipmentId={row.psa_id}
            onClose={handleClose}// Pass the close handler to the form
          />
        );
        setOpenDialogName('Upload Document')
        handleOpen()
        //  console.log("Edit row:", row.EQUIPMENT_ID)
      }
    },
    { label: "Upload Image", action: (row) => console.log("Edit row:", row) },
    { label: "Delete", action: (row) => console.log("Delete row:", row) },
  ];
  console.log(data)
  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No data found.</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hospital Data</h1>
      
      <CustomDataGrid
        rows={rows1}
        columns={columnDefs}
        checkboxSelection={false}
        initialColumnVisibility={initialColumnVisibility}
       contextMenuItems={contextMenuItems}
      />
    </main>
  );
}
