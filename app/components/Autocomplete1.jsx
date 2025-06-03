import React from "react";
import { TextField, Autocomplete } from "@mui/material";

const AutoCompleteField = ({ label, name, value, onChange, options, fullWidth = true }) => {
  // Convert options to an array of objects with unique keys
  const formattedOptions = options?.map((option, index) => ({
    label: option,
    id: index, // Ensure unique key
  })) || [];

  return (
    <Autocomplete
    freeSolo
    options={formattedOptions}
    getOptionLabel={(option) => String(option.label || "")} // Ensure string conversion
    renderOption={(props, option) => (
      <li {...props} key={option.id}>{option.label}</li>
    )}
    value={formattedOptions.find((opt) => opt.label === String(value)) || null}
    onChange={(event, newValue) =>
      onChange({ target: { name, value: newValue?.label || "" } })
    }
    renderInput={(params) => (
      <TextField {...params} label={label} name={name} fullWidth={fullWidth}
      size="small" 
      sx={{ minWidth: 150, fontSize: "0.875rem" }} />// Adjust width & font size 
    )}
  />
  );
};

export default AutoCompleteField;
