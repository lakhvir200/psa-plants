import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { format, parseISO, isValid } from "date-fns"; // Using date-fns for validation and formatting

export default function DynamicTextField({ multiline,rows,value, label, onChange,formatStr = "dd-MM-yyyy" }) {
  const [value1, setValue] = useState("");
  
  useEffect(() => {
   // console.log("inputValue received:", inputValue, "Type:", typeof inputValue);  
    // Check if inputValue looks like an ISO date string (adjust the regex as needed)
    const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (typeof value === "string" && isoDatePattern.test(value)) {
      // Handle ISO date strings correctly
      const date = parseISO(value);
      if (isValid(date)) {
        setValue(format(date, formatStr)); // Format valid dates
        return;
      }
    }
  
    // Fallback: Display raw text (but handle specific case like 'Medilab-250' more carefully)
    setValue(value || ""); // Keep it as text if not a valid date or other special cases
  }, [value, formatStr]);
  

  const handleChange = (e) => {
    setValue(e.target.value); // Allow user to edit input freely
  };

  return (
    <TextField
      label={label}
      variant="outlined"
      size="small"
      multiline = {multiline}
      value={value}
      rows={rows}
      onChange={ onChange} // Handle both date and text input
      fullWidth
    />
  );
}
