// getting a list of active users only & building table to display if user invited, active, clocked in etc. 

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import '../../node_modules/ag-grid-community/styles/ag-grid.css';
import '../../node_modules/ag-grid-community/styles/ag-theme-alpine.css'; 
import { getUsers, sendAppReminder } from '../API/Utilities';
import LabelledButton from '../Components/Buttons/LabelledButton';
import unixTimeToEmployeeTime from '../API/Utilities/unixTimeToEmployeeTime';
import calculateShiftDate  from '../API/Utilities/calculateShiftDate';
import calculateClockin from '../API/Utilities/calculateClockin';
import calculateNextSchedule from '../API/Utilities/calculateNextSchedule';

function ClockInUserGrid() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
      const users = await getUsers();
      console.log('Server response:', users); // TODO: remember to remove!  
  
      // invite status and mobile app status (has user logged into app yet?)
      const activeUsers = await Promise.all(users.filter(user => user.active).map(async user => {
        try {
        const isInvited = user.last_synced_mobile_app !== null;
        const isAppActive = isInvited ? user.last_synced_mobile_app !== 0 : false;
        const invited = isInvited ? "Invited" : "Send invite";
        const mobileApp = isAppActive ? unixTimeToEmployeeTime(user.last_synced_mobile_app, user.timezone) : (user.last_synced_mobile_app === 0 ? "Never" : null);
        
        // next shift, last shift 
        let prevShiftStart = null; 
  
        const nextSchedule = await calculateNextSchedule([user.id]);
        let nextScheduleStart = null;
        if (nextSchedule && nextSchedule[user.id]) {
          nextScheduleStart = unixTimeToEmployeeTime(nextSchedule[user.id].start, user.timezone);
          const nextScheduleEnd = unixTimeToEmployeeTime(nextSchedule[user.id].end, user.timezone);
          console.log('Next schedule start:', nextScheduleStart);
          console.log('Next schedule end:', nextScheduleEnd);
        }
  
        const prevShift = await calculateShiftDate('prev', user.id);
        if (prevShift) {
          prevShiftStart = unixTimeToEmployeeTime(prevShift.start, user.timezone);
          const prevShiftEnd = unixTimeToEmployeeTime(prevShift.end, user.timezone);
          console.log('Prev shift start:', prevShiftStart);
          console.log('Prev shift end:', prevShiftEnd);
        }

        const clockinData = await calculateClockin(user.id, user.timezone);

        // CLOCKIN REMINDERS AND WARNINGS
        const hasClockinData = clockinData.lastClockin;
        const clockinOverdue = prevShift && !hasClockinData;
        //const firstClockin = hasClockinData ? clockinData.firstClockin : (clockinOverdue ? "remind" : null);
        const lastClockin = hasClockinData ? clockinData.lastClockin : (clockinOverdue ? "remind" : null);


        // Date params for determining if needing to remind or warn about lack of app download   
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);


        // MOBILEAPP REMINDERS AND WARNINGS 
        const mobileAppRemind = isInvited && (!nextSchedule);
        const mobileAppWarning = isInvited && nextSchedule < oneWeekFromNow;
        let mobileAppStatus = mobileApp;
        if (mobileAppRemind) {
            mobileAppStatus = "reinvite";
        } else if (mobileAppWarning) {
            mobileAppStatus = "reinvite";
        }

        /*/// SEND REMINDERS 
        let sendReminder;
        if (user.invited && !user.mobileApp && nextScheduleStart) {
          sendReminder = "REMIND";
        } else if (mobileAppWarning) {
          sendReminder = "REMIND";
        } else if (mobileAppRemind) {
          sendReminder = "REINVITE";
        } else {
          sendReminder = "OPTIONAL";
        }*/

        let sendReminder = "send email"

        return { ...user, isInvited, isAppActive, invited, mobileApp: mobileAppStatus, nextSchedule: nextScheduleStart, prevShift: prevShiftStart, clockinOverdue, lastClockin, mobileAppRemind, mobileAppWarning, sendReminder };
        } catch (error) {
          console.error(`Error processing user ${user.id}:`, error);
          return null; // or some default user object
        }
      }));

      setRowData(activeUsers.filter(user => user !== null)); // filter out any null users
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Unable to display data due to internal system error. Please contact support or try again later.')
    }
  };

  fetchData();
}, []);

  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true, floatingFilter: true },
    { headerName: "Invited", field: "invited", sortable: true, filter: true, floatingFilter: true, width: 120 },
    { headerName: "Start date", field: "employment_start_date", sortable: true, filter: true, floatingFilter: true, width: 120 },
    { headerName: "Last app use", field: "mobileApp", sortable: true, filter: true, width: 140 },
    { headerName: "Recent clockin", field: "lastClockin", sortable: true, filter: true },
    { headerName: "Previous shift", field: "prevShift", sortable: true, filter: true }, 
    { headerName: "Next scheduled", field: "nextSchedule", sortable: true, filter: true },
    { headerName: "Send reminder", field: "sendReminder", sortable: true, filter: true }
  ];

  return (
    <>
    {error && <p>Error: {error}</p>}
    <div className="ag-theme-alpine grid-container mt-4" style={{ height: '500px', width: '100%' }}>
    <AgGridReact
        onGridReady={onGridReady}
        columnDefs={columns}
        rowData={rowData}
        pagination={true}
        paginationPageSize={10}
        getRowStyle={params => {
          if (params.data.clockinOverdue) {
            return { backgroundColor: '#FFA07A' }; // salmon color for clockinOverdue
          } else if (params.data.invited && !params.data.mobileApp && params.data.nextSchedule) {
            return { backgroundColor: '#FFFFE0' }; // yellow color for mobileApp warning
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