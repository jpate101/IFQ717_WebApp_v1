import React, { useState } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import '../../node_modules/ag-grid-community/styles/ag-grid.css';
import '../../node_modules/ag-grid-community/styles/ag-theme-alpine.css'; 

function ClockInUserGrid() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Active", field: "active", sortable: true, filter: true },
    { headerName: "Start date", field: "startDate", sortable: true, filter: true },
    { headerName: "1st Shift", field: "firstShift", sortable: true, filter: true },
    { headerName: "Invite", field: "invite", sortable: true, filter: true },
    { headerName: "1st Clockin", field: "firstClockin", sortable: true, filter: true },
    { headerName: "Reminder", field: "reminder", sortable: true, filter: true },
  ];

  // Replace this with your actual data
  const rowData = [];

  return (
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        onGridReady={onGridReady}
        columnDefs={columns}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
  );
}

export default ClockInUserGrid;