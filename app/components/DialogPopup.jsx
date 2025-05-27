"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function DialogPopup({ open, onClose, title, children }) {



  return (

    <Dialog open={open} onClose={onClose} maxWidth="100%" fullWidth sx={{ '& .MuiDialog-paper': { height: '90vh' } }}>


      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{title}</span>
        <Button
          color="secondary"
          onClick={() => { onClose(false) }} sx={{
            backgroundColor: "#f0f070",  // Background color for the button
                     // Round the button
            padding: "8px",               // Adjust padding for better size
            ":hover": {
              backgroundColor: "#dcdcdc", // Hover effect (optional)
            },
          }}

        >
          <CloseIcon />
        </Button>
      </DialogTitle>


      {/* ✅ Ensure Flex Layout in DialogContent */}
      <DialogContent dividers >
        {children}
      </DialogContent>

     
    </Dialog>
  );
}
