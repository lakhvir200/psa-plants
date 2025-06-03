import React from "react";
import { TextField } from "@mui/material";

const ReusableInput = ({ label, name, inputValue, onChange, fullWidth = true, multiline = false, rows = 1 }) => {
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
            rows={multiline ? rows :1} // Only set rows if multiline is true
        //    disabled={disabled}
        />
    );
};
export default ReusableInput;
