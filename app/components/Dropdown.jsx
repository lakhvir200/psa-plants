"use client";

import React from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

export default function Dropdown({ label, options, value, onChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
