import React from "react";
import { TextField, MenuItem } from "@mui/material";

const ReusableInput = ({
  label,
  name,
  inputValue,
  onChange,
  fullWidth = true,
  multiline = false,
  rows = 1,
  type = "text",       // "text" or "select"
  options = []         // array of options for dropdown
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={inputValue}
      onChange={onChange}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      multiline={multiline}
      rows={multiline ? rows : 1}
      select={type === "select"}   // this enables dropdown
    >
      {type === "select" &&
        options.map((opt, idx) => (
          <MenuItem key={idx} value={opt}>
            {opt}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default ReusableInput;
