'use client';

import React from 'react';
import { Button } from '@mui/material';
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import * as XLSX from 'xlsx';

const ExportToExcelButton = ({ data, filename = 'export', label = 'Export to XLS' }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

 const handleExport = () => {
  if (!data || data.length === 0) {
    alert('No data to export.');
    return;
  }
// console.log("Export Data:", data); // 👈 log here
// console.table(data);
  const isDateString = (value) =>
    typeof value === 'string' && !isNaN(Date.parse(value));

  // Format date-like fields dynamically
  const formattedData = data.map((row) => {
    const formattedRow = { ...row };
    for (const key in formattedRow) {
      if (isDateString(formattedRow[key])) {
        formattedRow[key] = formatDate(formattedRow[key]);
      }
    }
    return formattedRow;
  });

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Convert headers to uppercase
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C });
    if (worksheet[address] && worksheet[address].v) {
      worksheet[address].v = String(worksheet[address].v).toUpperCase();
    }
  }

  // Create and export workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};


  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<ArrowUpwardOutlinedIcon />}
      onClick={handleExport}
    >
      {label}
    </Button>
  );
};

export default ExportToExcelButton;
