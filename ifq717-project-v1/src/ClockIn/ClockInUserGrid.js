import React, { useState, useEffect } from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import '../../node_modules/ag-grid-community/styles/ag-grid.css';
import '../../node_modules/ag-grid-community/styles/ag-theme-alpine.css'; 
import { getUsers } from '../API/Utilities';

function ClockInUserGrid() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers();
      setRowData(users);
    };

    fetchData();
  }, []);

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Active", field: "active", sortable: true, filter: true },
    { headerName: "Start date", field: "employment_start_date", sortable: true, filter: false },
    { headerName: "1st Shift", field: "firstShift", sortable: true, filter: true },
    { headerName: "Clockin Invited", field: "invite", sortable: true, filter: true },
    { headerName: "1st Clockin", field: "firstClockin", sortable: true, filter: true },
    { headerName: "Reminder", field: "reminder", sortable: true, filter: true }
  ];

  return (
    <>
    <h1>Invite users to Clock In - the skeleton</h1>
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        onGridReady={onGridReady}
        columnDefs={columns}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
    </>
  );
}

export default ClockInUserGrid;