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
        const isAppActive = isInvited ? user.last_synced_mobile_app !== 0 : false;
        const invited = isInvited ? "Invited" : "Invite";
        const mobileApp = isAppActive ? unixTimeToEmployeeTime(user.last_synced_mobile_app, user.timezone) : (user.last_synced_mobile_app === 0 ? "Never" : null);
        
        let prevShiftStart = null; 
  
        const nextShift = await calculateShiftDate('next', user.id);
        let nextShiftStart = null;
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

        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

        // MOBILEAPP REMINDERS AND WARNINGS 
        const mobileAppRemind = isInvited && (!nextShift || nextShiftStart > oneWeekFromNow);
        const mobileAppWarning = isInvited && nextShiftStart < oneWeekFromNow;
        let mobileAppStatus = mobileApp;
        if (mobileAppRemind) {
            mobileAppStatus = "reinvite";
        } else if (mobileAppWarning) {
            mobileAppStatus = "reinvite";
        }

        // CLOCKIN REMINDERS AND WARNINGS
        const clockinOverdue = prevShift && !user.first_clockin;
        const firstClockin = clockinOverdue ? "remind" : user.first_clockin;

        return { ...user, isInvited, isAppActive, invited, mobileApp: mobileAppStatus, nextShift: nextShiftStart, prevShift: prevShiftStart, clockinOverdue, firstClockin, mobileAppRemind, mobileAppWarning };
    }));
  
      setRowData(activeUsers);
    };
  
    fetchData();
  }, []);

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true, floatingFilter: true },
    { headerName: "Start date", field: "employment_start_date", sortable: true, filter: true, floatingFilter: true },
    { headerName: "Invited", field: "invited", sortable: true, filter: true, floatingFilter: true },
    { headerName: "MobileApp", field: "mobileApp", sortable: true, filter: true },
    { headerName: "1st Clockin", field: "firstClockin", sortable: true, filter: true },
    { headerName: "Next shift", field: "nextShift", sortable: true, filter: true }, 
    { headerName: "Prev shift", field: "prevShift", sortable: true, filter: true }, 
  ];

  return (
    <>
    <h1>Invite users to Clock In - the skeleton. times are converted to employee timezone.</h1>
    <div className="ag-theme-alpine grid-container" style={{ height: '500px', width: '100%' }}>
    <AgGridReact
        onGridReady={onGridReady}
        columnDefs={columns}
        rowData={rowData}
        pagination={true}
        paginationPageSize={10}
        getRowStyle={params => {
            if (params.data.clockinOverdue) {
              return { backgroundColor: '#DB7093' }; // placeholder alert color
            } else if (params.data.mobileAppRemind) {
                return { backgroundColor: '#FFFFE0' }; // placeholder yellow color
            } else if (params.data.mobileAppWarning) {
              return { backgroundColor: '#FFA07A' }; // placeholder colour salmon
            }
            return {};
          }}
        />
    </div>
    </>
  );
}

export default ClockInUserGrid