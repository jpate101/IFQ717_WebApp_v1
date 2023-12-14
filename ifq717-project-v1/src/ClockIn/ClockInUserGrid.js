// getting a list of active users only & building table to display if user invited, active, clocked in etc. 

import React, { useState, useEffect } from 'react';
import { getUsers } from '../API/Utilities';
import LabelledButton from '../Components/Buttons/LabelledButton';
import unixTimeToEmployeeTime from '../API/Utilities/unixTimeToEmployeeTime';
import calculateShiftDate  from '../API/Utilities/calculateShiftDate';
import calculateClockin from '../API/Utilities/calculateClockin';
import calculateNextSchedule from '../API/Utilities/calculateNextSchedule';
import RemindButton from './RemindButton';
import Pagination from '../Components/Pagination';
import '../App.css';

function ClockInUserGrid() {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

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
        const mobileApp = isAppActive ? unixTimeToEmployeeTime(user.last_synced_mobile_app, user.timezone) : '';
        
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

        let sendReminder = "send email"

        return { ...user, isInvited, isAppActive, invited, mobileApp: mobileAppStatus, nextSchedule: nextScheduleStart, prevShift: prevShiftStart, clockinOverdue, lastClockin, mobileAppRemind, mobileAppWarning, sendReminder };
        } catch (error) {
          console.error(`Error processing user ${user.id}:`, error);
          return null; 
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
    { headerName: "Invited", field: "isInvited", sortable: true, filter: true, floatingFilter: true, width: 120, cellRenderer: 'inviteIconRenderer', cellRendererParams: { isInvited: (params) => params.data.isInvited,
    }, 
  },
    { headerName: "Start date", field: "employment_start_date", sortable: true, filter: true, floatingFilter: true, width: 120 },
    { headerName: "Last app use", field: "mobileApp", sortable: true, filter: true, width: 140 },
    { headerName: "Recent clockin", field: "lastClockin", sortable: true, filter: true },
    { headerName: "Previous shift", field: "prevShift", sortable: true, filter: true }, 
    { headerName: "Next scheduled", field: "nextSchedule", sortable: true, filter: true }
  ];

  // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    

  return (
    <>
    {error && <p>Error: {error}</p>}
    <div className="mt-4">
      <table className="table-auto w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2">{column.headerName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {rowData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((row, index) => (
          <tr key={index}>
          <td className="border px-4 py-2">{row.name}</td>
          <td className="border px-4 py-2">
          {row.isInvited ? 
            "Invited" : 
            <LabelledButton buttonText="Invite" to="http://localhost:3000/root/EmployeeManagement/" className="approve-button" />
          }
          </td>
          <td className="border px-4 py-2">{row.employment_start_date}</td>
          <td className="border px-4 py-2">{!row.isAppActive && row.isInvited ? <RemindButton userId={row.id} isClockinOverdue={false} /> : row.mobileApp}</td>
          <td className="border px-4 py-2">{row.lastClockin === 'remind' ? <RemindButton userId={row.id} isClockinOverdue={true} /> : row.lastClockin}</td>
          <td className="border px-4 py-2">{row.prevShift}</td>
          <td className="border px-4 py-2">{row.nextSchedule}</td>
        </tr>
        ))}
      </tbody>
      </table>
      <div className="flex justify-center">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={rowData.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
    </>
  );
}

export default ClockInUserGrid