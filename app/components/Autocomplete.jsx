"use client";

import React from "react";
import { Autocomplete, TextField, Box } from "@mui/material";

export default function AutocompleteDropdown({ label, options, value, onChange,style }) {
  return (
    <Box style={{ marginBottom: "5px", width: "90%" }}>
      <Autocomplete
        options={options}
        value={value}
        onChange={onChange}
        sx={{
          "& .MuiInputBase-root": {
            height: "40px", // Adjust height for the input box
          },
          "& .MuiAutocomplete-listbox": {
            fontSize: "0.875rem", // Optional: Smaller font size for dropdown options
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px", // Adjust height of the input field
                "& input": {
                  padding: "8px", // Adjust padding for the input text
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.875rem", // Optional: Smaller font size for label
                top: "-5px", // Adjust label position (if needed)
              },
            }}
            style={style}
          />
        )}
      />
    </Box>
  );
}

// "use client";

// import React from "react";
// import { Autocomplete, TextField, Box } from "@mui/material";

// export default function AutocompleteDropdown({ label, options, value, onChange, }) {
//   return (
//     <Box style={{ marginBottom: "5px", width:"90%"}}>
//       <Autocomplete
//         options={options}
//         value={value}
//         onChange={(event, newValue) => onChange(newValue)}
//         renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
//       />
      
//     </Box>
//   );
// }
