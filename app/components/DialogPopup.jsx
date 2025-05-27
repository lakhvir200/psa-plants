// "use client";

// import React from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';

// export default function DialogPopup({ open, onClose, title, children }) {



//   return (

//     <Dialog open={open} onClose={onClose} maxWidth="100%" fullWidth sx={{ '& .MuiDialog-paper': { height: '90vh' } }}>


//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <span>{title}</span>
//         <Button
//           color="secondary"
//           onClick={() => { onClose(false) }} sx={{
//             backgroundColor: "#f0f070",  // Background color for the button
//                      // Round the button
//             padding: "8px",               // Adjust padding for better size
//             ":hover": {
//               backgroundColor: "#dcdcdc", // Hover effect (optional)
//             },
//           }}

//         >
//           <CloseIcon />
//         </Button>
//       </DialogTitle>


//       {/* ✅ Ensure Flex Layout in DialogContent */}
//       <DialogContent dividers >
//         {children}
//       </DialogContent>

     
//     </Dialog>
//   );
// }
"use client";

import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ModalPopup({ open, onClose, children, title }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          {title}
        </Typography>
        {children}
        <Box mt={2} textAlign="right">
          <Button onClick={onClose} variant="outlined">Close</Button>
        </Box>
      </Box>
    </Modal>
  );
}
