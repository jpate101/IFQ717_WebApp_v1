import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useParams, useLocation } from 'react-router-dom';
import { getUserInfo, approveShift } from '../API/Utilities';
import WeekPickerComponent from '../Components/Roster&Timesheets/WeekPicker';
import dayjs from 'dayjs';

const API_BASE_URL = 'https://my.tanda.co/api/v2';

// Helper function to get headers with the Authorization token
const getHeaders = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};


const StatusSelect = ({ shiftId, initialStatus, onUpdate }) => {
  const [status, setStatus] = useState(initialStatus);

  console.log(`Rendering StatusSelect for shiftId ${shiftId} with initialStatus ${initialStatus}`);

  useEffect(() => {
    console.log(`StatusSelect useEffect called. Updating status to ${initialStatus} for shiftId ${shiftId}`);
    setStatus(initialStatus); 
  }, [initialStatus]);

  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus); 
    await onUpdate(shiftId, newStatus);
  };

  return (
    <select
      className="form-select-sm small-text"
      value={status}
      onChange={handleChange}
      aria-label="Timesheet Status Select"
    >
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
    </select>
  );
};

const TimesheetForUser = () => {
  let { userId } = useParams();
  let location = useLocation();
  const [timesheet, setTimesheet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const useQuery = () => {
    return new URLSearchParams(location.search);
  }

  let query = useQuery();
  let startOfWeek = query.get('start');
  let endOfWeek = query.get('end');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const headers = getHeaders();
      
      const userInfoResponse = await getUserInfo(userId);
      setUserName(userInfoResponse.name); 

      const startDate = dayjs(startOfWeek);
      const endDate = dayjs(endOfWeek);
      let allShifts = [];
  
      for (let date = startDate; date.isSameOrBefore(endDate); date = date.add(1, 'day')) {
        const dateString = date.format('YYYY-MM-DD');
        const url = `${API_BASE_URL}/timesheets/for/${userId}/on/${dateString}?show_costs=true&show_award_interpretation=true`;
  
        try {
          const response = await fetch(url, { method: 'GET', headers });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          allShifts = allShifts.concat(data.shifts);
        } catch (error) {
          setError(error);
        }
      }
  
      // Set the combined shifts to state
      setTimesheet({ ...timesheet, shifts: allShifts });
      setIsLoading(false);
    };
  
    if (userId && startOfWeek && endOfWeek) {
      fetchData();
    }
  }, [userId, startOfWeek, endOfWeek]);

  useEffect(() => {
    if (startOfWeek) {
      setSelectedDate(new Date(startOfWeek));
    }
  }, [startOfWeek]);
  

  const formatDate = (timestamp) => {
    // If the timestamp is 0 or the date matches the Unix epoch start, return 'pending'
    if (timestamp === 0 || new Date(timestamp * 1000).toISOString() === '1970-01-01T00:00:00.000Z') {
      return 'pending';
    }
    // Format the time to show hours and minutes only
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStatusChange = async (shiftId, newStatus) => {
    try {
      // Only call approveShift if the new status is 'approved'
      if (newStatus === 'approved') {
        const updatedShift = await approveShift(shiftId);
        console.log('Shift status updated:', updatedShift);
      }

      setTimesheet((currentTimesheet) => {
        // Find the index of the shift that was updated
        const shiftIndex = currentTimesheet.shifts.findIndex(s => s.id === shiftId);
        if (shiftIndex === -1) return currentTimesheet; // If not found, return the current timesheet without changes
        
        // Create a new copy of shifts and update the status of the appropriate shift
        const updatedShifts = [...currentTimesheet.shifts];
        updatedShifts[shiftIndex] = { ...updatedShifts[shiftIndex], status: newStatus.toUpperCase() };
  
        // Return a new timesheet object with the updated shifts array
        return { ...currentTimesheet, shifts: updatedShifts };
      });
  
    } catch (error) {
      console.error('Failed to update shift status:', error);
      // Handle error (e.g., show a message to the user)
    }
  };

  return (
    <>
      <WeekPickerComponent
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <Table hover>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Shift Date</th>
            <th>Start</th>
            <th>Finish</th>
            <th>Shift Status</th>
          </tr>
        </thead>
        <tbody>
        {timesheet && timesheet.shifts ? (
          timesheet.shifts.map((shift) => {
            console.log(`Shift data:`, shift);
            return (
              <tr key={shift.id}>
                <td>{userName}</td>
                <td>{new Date(shift.date).toLocaleDateString()}</td>
                <td>{formatDate(shift.start)}</td>
                <td>{formatDate(shift.finish)}</td>
                <td>
                  <StatusSelect
                    shiftId={shift.id}
                    initialStatus={shift.status.toLowerCase()}
                    onUpdate={handleStatusChange}
                  />
                </td>
              </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Loading timesheet data...</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default TimesheetForUser;
