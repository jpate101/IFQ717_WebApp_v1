// getting a list of active users only & building table to display if user invited, active, clocked in etc. 

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../../node_modules/ag-grid-community/styles/ag-grid.css';
import '../../node_modules/ag-grid-community/styles/ag-theme-alpine.css'; 
import { getUsers } from '../API/Utilities';
import unixTimeToEmployeeTime from '../API/Utilities/unixTimeToEmployeeTime';
import calculateShiftDate  from '../API/Utilities/calculateShiftDate';

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
  
      const activeUsers = await Promise.all(users.filter(user => user.active).map(async user => {
        const isInvited = user.last_synced_mobile_app !== null;
        const isAppActive = user.last_synced_mobile_app !== 0;
        const invited = isInvited ? "Invited" : "Invite";
        const mobileApp = isAppActive ? unixTimeToEmployeeTime(user.last_synced_mobile_app, user.timezone) : (user.last_synced_mobile_app === 0 ? "Never" : null);
        
        let nextShiftStart = null, prevShiftStart = null; // Initialize here
  
        const nextShift = await calculateShiftDate('next', user.id);
        if (nextShift) {
          nextShiftStart = unixTimeToEmployeeTime(nextShift.start, user.timezone);
          const nextShiftEnd = unixTimeToEmployeeTime(nextShift.end, user.timezone);
          console.log('Next shift start:', nextShiftStart);
          console.log('Next shift end:', nextShiftEnd);
        }
  
        const prevShift = await calculateShiftDate('prev', user.id);
  if (prevShift) {
          prevShiftStart = unixTimeToEmployeeTime(prevShift.start, user.timezone);
          const prevShiftEnd = unixTimeToEmployeeTime(prevShift.end, user.timezone);
          console.log('Prev shift start:', prevShiftStart);
          console.log('Prev shift end:', prevShiftEnd);
        }
  
        return { ...user, isInvited, isAppActive, invited, mobileApp, nextShift: nextShiftStart, prevShift: prevShiftStart };
}));
  
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
    { headerName: "Next shift", field: "nextShift", sortable: true, filter: true }, // new column
    { headerName: "Prev shift", field: "prevShift", sortable: true, filter: true }, // new column
  ];

  return (
    <>
    <h1>Invite users to Clock In - the skeleton. times are converted to employee timezone.</h1>
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

export default ClockInUserGrid