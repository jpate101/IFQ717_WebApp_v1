// getting a list of active users only & building table to display if user invited, active, clocked in etc. 

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
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
      console.log('Server response:', users); // TODO: remember to remove! 
  
      const activeUsers = users.filter(user => user.active).map(user => {
        const isInvited = user.last_synced_mobile_app !== null;
        const isAppActive = user.last_synced_mobile_app !== 0;
        const invited = isInvited ? "Invited" : "Invite";
        const mobileApp = isAppActive ? (user.last_synced_mobile_app !== null ? user.last_synced_mobile_app.toString() : null) : (user.last_synced_mobile_app === 0 ? "Never" : null);
  
        console.log('My calculated data:', { ...user, isInvited, isAppActive, invited, mobileApp }); // TODO: remember to remove! 
  
        return { ...user, isInvited, isAppActive, invited, mobileApp };
      });
  
      setRowData(activeUsers);
    };
  
    fetchData();
  }, []);

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Start date", field: "employment_start_date", sortable: true, filter: false },
    { headerName: "Invited", field: "invited", sortable: true, filter: true },
    { headerName: "MobileApp", field: "mobileApp", sortable: true, filter: true },
    { headerName: "1st Clockin", field: "first_clockin", sortable: true, filter: true },
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
        paginationPageSize={10}
      />
    </div>
    </>
  );
}

export default ClockInUserGrid;