import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

const ReusableCheckBox = ({ label, name, checked, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          checked={checked}
          onChange={(event) => onChange(event.target.name, event.target.checked)}
          color="primary"
        />
      }
      label={label}
    />
  );
};

export default ReusableCheckBox;
