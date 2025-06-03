"use client";
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import 'ag-grid-enterprise'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


const AGGridComponent = ({ columnDefs, rowData,getContextMenuItems }) => {
  const gridModules = [ClientSideRowModelModule]; // Register the module

    const excelStyles = [
        {
          id: "ExcelDateTime",
          dataType: "dateTime",
          numberFormat: { format: "dd-mm-yyyy hh:mm:ss;;;" }
        },
        {
          id: "dateType",
          dataType: "dateTime",
          numberFormat: { format: "dd-mm-yyyy;;;" }
        }
      ];
      const defaultColDef = {
        cellStyle: {textAlign: 'left'},
        sortable: true,
      filter: true,
        resizable: true,
    
        // floatingFilter: true,
      }
      const rowSelectionType = 'single'

    return (
        
        
        <div className="ag-theme-alpine" style={{ height: 480, width: '100%' }}>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                getContextMenuItems={getContextMenuItems}  
                defaultColDef={defaultColDef} 
                rowSelection={rowSelectionType} 
                excelStyles={excelStyles}     
                pagination='true' 
                modules={gridModules} // Pass the registered modules    
                >
                
            </AgGridReact>
        </div>
    );
};

export default AGGridComponent;