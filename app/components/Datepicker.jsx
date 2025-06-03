import * as React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

export default function DatePickerField({ label, name, value, onChange, fullWidth }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}  // Ensure dayjs object
        format="DD-MM-YYYY"  // Set date format
        onChange={(newValue) =>
          onChange({ target: { name, value: newValue ? newValue.format("YYYY-MM-DD") : "" } })
        }
        slotProps={{ textField: { size: "small" } }} 
        sx={{ width: fullWidth ? "100%" : "auto" }}
      />
    </LocalizationProvider>
  );
}
