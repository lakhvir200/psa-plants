"use client";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function RowContextMenu({
  rows,
  columns,
  initialColumnVisibility,
  pageSize = 5,
  rowsPerPageOptions = [5, 10, 20],
  contextMenuItems = [],
  gridStyles = {},
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    const rowId = Number(event.currentTarget.getAttribute("data-id"));
    setSelectedRow(rowId);
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleMenuItemClick = (action) => {
    if (action && selectedRow !== null) {
      const row = rows.find((r) => r.id === selectedRow);
      action(row); // Perform the action with the selected row
    }
    handleClose();
  };

  return (
    <div style={{ height: 450, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        initialState={{
          columns: { columnVisibilityModel: initialColumnVisibility },
        }}
        sx={{
          "& .MuiDataGrid-cell": { fontSize: "0.875rem", ...gridStyles.cell },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "0.875rem",
            ...gridStyles.columnHeaders,
          },
          "& .MuiDataGrid-footerContainer": {
            fontSize: "0.75rem",
            ...gridStyles.footer,
          },
          "& .MuiDataGrid-columnHeaders": {
            fontWeight: "bold",
          },

        }

        }
        slotProps={{
          row: {
            onContextMenu: handleContextMenu,
            style: { cursor: "context-menu" },
          },
        }}
        disableSelectionOnClick
      />

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {contextMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleMenuItemClick(item.action)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
