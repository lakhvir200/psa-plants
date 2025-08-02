
'use client';

import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ReusableModal from '../components/DialogPopup';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDialogName, setOpenDialogName] = useState('');
  const [dialogContent, setDialogContent] = useState(null);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 150 }}
          onClick={() => router.push('/cmc')}
        >
          CMC
        </Button>

        <Button
          variant="contained"
          color="secondary"
          sx={{ minWidth: 150 }}
          onClick={() => router.push('/services')}
        >
          Services
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ minWidth: 150 }}
          onClick={() => router.push('/important-tasks')}
        >
          Important Tasks
        </Button>
      </Box>
      <ReusableModal
        open={isModalOpen}
        onClose={handleClose}
        title={openDialogName}
      >
        {dialogContent}
      </ReusableModal> */}
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <img
          src="/images/MENTIS.jpg"
          alt={"equipmentData.model"}
          width={550}
          height={550}
          style={{ border: "1px solid #ccc", objectFit: "cover" }}
        />
      </Box>
    </div>
  );
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Box, Button } from '@mui/material';
// import CustomDataGrid from '../components/DataGrid'
// import ReusableModal from "../components/DialogPopup";

// export default function AdminDashboard() {
//   const [selectedPage, setSelectedPage] = useState(null);
//   const [rows, setRows] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//    const [openDialogName, setOpenDialogName] = useState('');
//    const [dialogContent, setDialogContent] = useState(null);

//   useEffect(() => {
//     handleLoadData('cmc');
//   }, []);

//   const handleOpen = () => {
//     setIsModalOpen(true);
//     //console.log("Opening modal...");
//   };
//   const handleClose = () => {
//     setIsModalOpen(false);
//     // console.log("closing modal...");
//   }

//   const handleLoadData = async (type) => {
//     setSelectedPage(type);
//     setLoading(true);
//     let apiUrl = '';
//     let selectedColumns = [];
//     try {
//       let apiUrl = '';
//       switch (type) {
//         case 'psa':
//           apiUrl = '/api/cmc'; // update as per your actual API
//           selectedColumns = columnDefsCMC;
//           break;
//         case 'cmc':
//           apiUrl = '/api/cmc';
//           selectedColumns = columnDefsCMC;
//           break;
//         case 'services':
//           apiUrl = '/api/services';
//           selectedColumns = columnDefsServices;
//           break;
//         default:
//           apiUrl = '';
//       }

//       const res = await fetch(apiUrl);
//       const data = await res.json();
//       setRows(data); // Make sure your API returns an array of rows
//       setColumnDefs(selectedColumns);
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const columnDefsCMC = [
//     { headerName: "ID", field: "psa_id", width: 100 },
//     { headerName: "CUSTOMER NAME", field: "customer_name", width: 250 },
//     // { headerName: "STATE", field: "state", width: 150 },
//     // { headerName: "CITY", field: "city", width: 150 },
//     { headerName: "CMC", field: "amc_cmc", width: 80 },

//     {
//       field: "start_date",
//       headerName: "START DATE",
//       width: 100,
//       renderCell: (params) => {
//         if (!params.value) return ''; // Handle null or undefined values
//         const date = new Date(params.value); // Convert to Date object
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//       }
//     },
//     {
//       field: "end_date",
//       headerName: "END DATE",
//       width: 100,
//       renderCell: (params) => {
//         if (!params.value) return ''; // Handle null or undefined values
//         const date = new Date(params.value); // Convert to Date object
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//       }
//     },
//     // { headerName: "RATE", field: "rate", width: 100 },
//     // { headerName: "AMOUNT", field: "amount", width: 100 },

//     {
//       headerName: "DUE IN DAYS",
//       field: "days_left",
//       width: 150,
//       renderCell: (params) => {
//         const { end_date } = params.row;

//         if (!end_date) {
//           return (
//             <span style={{ color: 'red', fontWeight: 'bold' }}>
//               0
//             </span>
//           );
//         }

//         const endDate = new Date(end_date);
//         const today = new Date();
//         endDate.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         const diff = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));

//         if (diff > 0 && diff < 30) {
//           return (
//             <span style={{ color: 'orange', fontWeight: 'bold' }}>
//               -{diff} days
//             </span>
//           );
//         }

//         if (diff > 0) {
//           return (
//             <span style={{ color: 'green', fontWeight: 'bold' }}>
//               -{diff} days
//             </span>
//           );
//         }

//         if (diff < 0) {
//           return (
//             <span style={{ color: 'red', fontWeight: 'bold' }}>
//               +{Math.abs(diff)} days overdue
//             </span>
//           );
//         }

//         return <span style={{ fontWeight: 'bold' }}>Due Today</span>;
//       }
//     },
//     {
//       headerName: "ACTION",
//       field: "action_required",
//       width: 180,
//       renderCell: (params) => {
//         const { end_date } = params.row;

//         if (!end_date) return null;

//         const endDate = new Date(end_date);
//         const today = new Date();
//         endDate.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         const diff = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));

//         if (diff > 0 && diff < 30) {
//           return (
//             <span style={{ color: 'orange', fontWeight: 'bold' }}>
//               Follow-up Required
//             </span>
//           );
//         }

//         if (diff < 0) {
//           return (
//             <span style={{ color: 'red', fontWeight: 'bold' }}>
//               Follow-up Required
//             </span>
//           );
//         }

//         return null;
//       }
//     },

//     // { headerName: "ISACTIVE", field: 'is_active', width: 100 },
//     { headerName: "REMARKS", field: "remarks", width: 200 },
//     {
//       headerName: "ADD",
//       field: "add_action",
//       width: 100,
//       renderCell: (params) => {
//         const handleClick = () => {
//           // You can replace this with any logic (e.g., open modal, navigate)
//           alert(`Add clicked for ID: ${params.row.psa_id}`);
//         };

//         return (
//           <button
//             style={{
//               backgroundColor: '#1976d2',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               padding: '6px 12px',
//               cursor: 'pointer',
//             }}
//             onClick={handleClick}
//           >
//             Add
//           </button>
//         );
//       }
//     },
//      {
//       headerName: "UPLOAD ",
//       field: "upload_action",
//       width: 120,
//       renderCell: (params) => {
//         const handleClick = () => {
//           // You can replace this with any logic (e.g., open modal, navigate)
//           alert(`Add clicked for ID: ${params.row.psa_id}`);
//         };

//         return (
//           <button
//             style={{
//               backgroundColor: '#1976d2',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               padding: '6px 12px',
//               cursor: 'pointer',
//             }}
//             onClick={handleClick}
//           >
//             Upload CMC
//           </button>
//         );
//       }
//     }
//   ]
//   const columnDefsServices = [
//     { headerName: "ID", field: "psa_id", width: 100 },
//     { headerName: "CUSTOMER NAME", field: "customer_name", width: 250 },
//     { headerName: "SERVICE(HRS)", field: "service_hrs", width: 100 },
//     // { headerName: "STATE", field: "state", width: 150 },
//     // { headerName: "CITY", field: "city", width: 150 },
//     // { headerName: "AMC_CMC", field: "amc_cmc", width: 120 },

//     {
//       field: "serviced_on",
//       headerName: "DATE OF SERVICE",
//       width: 150,
//       renderCell: (params) => {
//         if (!params.value) return ''; // Handle null or undefined values
//         const date = new Date(params.value); // Convert to Date object
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//       }
//     },
//     { headerName: "CURRENT HRS", field: "current_hrs", width: 100 },
//     {
//       headerName: "NEXT SERVICE DATE",
//       field: "next_service_date",
//       width: 100,
//       renderCell: (params) => {
//         const { service_hrs, serviced_on } = params.row;

//         if (!service_hrs || !serviced_on) return '';

//         const baseDate = new Date(serviced_on);

//         // Convert hours to milliseconds
//         const nextServiceDate = new Date(baseDate.getTime() + service_hrs * 60 * 60 * 1000);

//         const day = String(nextServiceDate.getDate()).padStart(2, '0');
//         const month = String(nextServiceDate.getMonth() + 1).padStart(2, '0');
//         const year = nextServiceDate.getFullYear();

//         return `${day}-${month}-${year}`;
//       }
//     },
//     // {
//     //   headerName: "NEXT SERVICE DATE",
//     //   field: "next_service_date",
//     //   width: 200,
//     //   renderCell: (params) => {
//     //     const { service_hrs, serviced_on } = params.row;

//     //     if (!service_hrs || !serviced_on) return '';

//     //     const baseDate = new Date(serviced_on);

//     //     // Convert hours to milliseconds
//     //     const nextServiceDate = new Date(baseDate.getTime() + service_hrs * 60 * 60 * 1000);

//     //     const day = String(nextServiceDate.getDate()).padStart(2, '0');
//     //     const month = String(nextServiceDate.getMonth() + 1).padStart(2, '0');
//     //     const year = nextServiceDate.getFullYear();

//     //     return `${day}-${month}-${year}`;
//     //   }
//     // },

//     // { headerName: "RATE", field: "rate", width: 100 },
//     // { headerName: "AMOUNT", field: "amount", width: 100 },

//     {

//       headerName: "DUE IN DAYS",
//       field: "days_left",
//       width: 90,
//       renderCell: (params) => {
//         const { service_hrs, serviced_on } = params.row;
//         if (!service_hrs || !serviced_on) return '';
//         const serviceDays = Math.floor(service_hrs / 24);


//         const baseDate = new Date(serviced_on);
//         const today = new Date();

//         // Clear time to ensure accurate difference
//         baseDate.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         // Get the difference in milliseconds
//         const diffMs = today - baseDate;


//         // Convert milliseconds to hours
//         // const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//         const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));


//         const diff = serviceDays - diffDays
//         console.log('dif', diff)

//         if (diff > 0 && diff < 30) {
//           return (
//             <span style={{ color: 'orange', fontWeight: 'bold' }}>
//               -{diff} days
//             </span>
//           );
//         }

//         if (diff > 0) {
//           return (
//             <span style={{ color: 'green', fontWeight: 'bold' }}>
//               -{diff} days
//             </span>
//           );
//         }

//         if (diff < 0) {
//           return (
//             <span style={{ color: 'red', fontWeight: 'bold' }}>
//               +{Math.abs(diff)} days overdue
//             </span>
//           );
//         }

//         return <span style={{ fontWeight: 'bold' }}>Due Today</span>;
//       }
//     },

//     {
//       headerName: "ACTION",
//       field: "action_required",
//       width: 150,
//       renderCell: (params) => {
//         const { end_date } = params.row;

//         if (!end_date) return null;

//         const endDate = new Date(end_date);
//         const today = new Date();
//         endDate.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         const diff = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));

//         if (diff > 0 && diff < 30) {
//           return (
//             <span style={{ color: 'orange', fontWeight: 'bold' }}>
//               Follow-up Required
//             </span>
//           );
//         }

//         if (diff < 0) {
//           return (
//             <span style={{ color: 'red', fontWeight: 'bold' }}>
//               Follow-up Required
//             </span>
//           );
//         }

//         return null;
//       }
//     },

//     { headerName: "Remarks", field: 'notes', width: 100 },
//     //{ headerName: "REMARKS", field: "remarks", width: 200 },
//     {
//       headerName: "ADD",
//       field: "add_action",
//       width: 100,
//       renderCell: (params) => {
//         const handleClick = () => {
//           // You can replace this with any logic (e.g., open modal, navigate)
//           alert(`Add clicked for ID: ${params.row.psa_id}`);
//         };

//         return (
//           <button
//             style={{
//               backgroundColor: '#1976d2',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               padding: '6px 12px',
//               cursor: 'pointer',
//             }}
//             onClick={handleClick}
//           >
//             Add
//           </button>
//         );
//       }
//     },
//     {
//       headerName: "UPLOAD ",
//       field: "upload_action",
//       width: 120,
//       renderCell: (params) => {
//         const handleClick = () => {
//           // You can replace this with any logic (e.g., open modal, navigate)
//           alert(`Add clicked for ID: ${params.row.psa_id}`);
//         };

//         return (
//           <button
//             style={{
//               backgroundColor: '#1976d2',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               padding: '6px 12px',
//               cursor: 'pointer',
//             }}
//             onClick={handleClick}
//           >
//             Upload Report
//           </button>
//         );
//       }
//     }


//   ]
//   const initialColumnVisibility = {
//     rate: false,
//     amount: false,
//   };
//   const rows1 = rows.map((item) => ({
//     id: item.psa_id,
//     ...item,
//   }));
//   console.log(rows1)

//   return (
//     <div>
//       <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ minWidth: 150 }}
//           onClick={() => handleLoadData('cmc')}
//         >
//           CMC
//         </Button>
//         <Button
//           variant="contained"
//           color="secondary"
//           sx={{ minWidth: 150 }}
//           onClick={() => handleLoadData('services')}
//         >
//           Services
//         </Button>
//         <Button
//           variant="contained"
//           color="success"
//           sx={{ minWidth: 150 }}
//           onClick={() => handleLoadData('services')}
//         >
//           Important Tasks
//         </Button>
//       </Box>
//       <ReusableModal
//         open={isModalOpen}
//         onClose={handleClose}
//         title={openDialogName}
//       >
//         {dialogContent}
//       </ReusableModal>
//       <Box mt={3}>
//         {selectedPage && (
//           <CustomDataGrid rows={rows1}
//             columns={columnDefs}
//             initialColumnVisibility={initialColumnVisibility}
//             loading={loading} />
//         )}
//       </Box>
//     </div>
//   );
// }
