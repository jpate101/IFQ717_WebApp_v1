import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import WeekPickerComponent from '../Components/Roster&Timesheets/WeekPicker';
import { getUsers, getRosterForDate } from '../API/Utilities';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

const API_BASE_URL = 'https://my.tanda.co/api/v2';

const getHeaders = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to format week range
const formatWeekRange = (date) => {
    if (!date || !dayjs(date).isValid()) {
        console.error('formatWeekRange - received invalid date:', date);
        return 'Invalid Date Range';
    }
    // Use isoWeek to set start of the week to Monday
    const startOfWeek = dayjs(date).startOf('isoWeek');
    const endOfWeek = startOfWeek.add(6, 'day'); // Add 6 days to startOfWeek to get the endOfWeek
    return `${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM YYYY')}`;
};

// Helper function to calculate cost of hours worked
const calculateCost = (workedHours, hourly_rate) => {
    console.log(`Calculating cost: Worked Hours = ${workedHours}, Hourly Rate = ${hourly_rate}`);
    return workedHours * hourly_rate;
  };

// Helper function to calculate rostered hours
const calculateRosteredHours = (schedule) => {
    const start = dayjs.unix(schedule.start);
    const finish = dayjs.unix(schedule.finish);
    let totalMinutes = finish.diff(start, 'minute');
    
    // Subtract only unpaid break lengths
    schedule.breaks.forEach(breakTime => {
        if (!breakTime.paid) { // Check if the break is not paid
            const breakLength = breakTime.length;
            totalMinutes -= breakLength;
        }
    });
    
    return totalMinutes / 60; // Convert minutes to hours
};;

const ApproveTimesheetsPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf('isoWeek'));
  const [timesheets, setTimesheets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRosteredHours = useRef(false);
  const navigate = useNavigate();

  // Handles the row click which opens the TimesheetForUser page
  const handleRowClick = (userId) => {
    navigate(`/timesheet-for-user/${userId}?start=${selectedDate.startOf('isoWeek').format('YYYY-MM-DD')}&end=${selectedDate.endOf('isoWeek').format('YYYY-MM-DD')}`);
  };
  

  const fetchTimesheets = async (startDate) => {
    setLoading(true);
    const endDate = startDate.endOf('isoWeek');
    let allTimesheets = [];
    try {
      const headers = getHeaders();
      for (let date = dayjs(startDate); date.isSameOrBefore(endDate); date = date.add(1, 'day')) {
        const dateForTimesheet = date.format('YYYY-MM-DD');
        const response = await fetch(`${API_BASE_URL}/timesheets/on/${dateForTimesheet}?show_costs=true&show_award_interpretation=true`, {
          method: 'GET',
          headers: headers
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const dailyTimesheets = await response.json();
        allTimesheets = allTimesheets.concat(dailyTimesheets);
      }
  
      setTimesheets(allTimesheets);
    } catch (error) {
      console.error('Error fetching timesheets for week:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate.isValid()) {
      fetchTimesheets(selectedDate);
      fetchedRosteredHours.current = false; 
    }
  }, [selectedDate]); 

  const handleDateChange = (date) => {
    if (date) {
      const newSelectedDate = dayjs(date).startOf('isoWeek');
      setSelectedDate(newSelectedDate);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId) || null;
  };
  
  const fetchRosteredHours = async () => {
    const fromDate = selectedDate.startOf('isoWeek').format('YYYY-MM-DD');
    const toDate = selectedDate.endOf('isoWeek').format('YYYY-MM-DD');
  
    try {
     
      const rosterPromises = [];
      for (let date = dayjs(fromDate); date.isSameOrBefore(toDate); date = date.add(1, 'day')) {
        rosterPromises.push(getRosterForDate(date.format('YYYY-MM-DD')));
      }
      const rosters = await Promise.all(rosterPromises);
    console.log('Rosters:', rosters); 

    const schedules = rosters.flatMap(roster => roster.schedules.flatMap(schedule => schedule.schedules));
    console.log('Schedules:', schedules); 

    const updatedTimesheets = timesheets.map(timesheet => {
      const userSchedules = schedules.filter(schedule => schedule.user_id === timesheet.user_id);
      console.log(`UserID ${timesheet.user_id} Schedules:`, userSchedules); // Log schedules for this user

      const totalRosteredHours = userSchedules.reduce((acc, schedule) => {
        const rosteredHoursForSchedule = calculateRosteredHours(schedule);
        console.log(`Schedule:`, schedule, 'Rostered Hours:', rosteredHoursForSchedule);
        return acc + rosteredHoursForSchedule;
      }, 0);

      console.log(`Total Rostered Hours for UserID ${timesheet.user_id}:`, totalRosteredHours); 

      return {
        ...timesheet,
        rosteredHours: totalRosteredHours.toFixed(2) 
      };
    });

    console.log('Updated Timesheets:', updatedTimesheets);
    setTimesheets(updatedTimesheets);
  } catch (error) {
    console.error('Error fetching rostered hours:', error);
  }
};

  useEffect(() => {
    if (!fetchedRosteredHours.current && timesheets.length > 0 && users.length > 0) {
      fetchRosteredHours().then(() => {
        fetchedRosteredHours.current = true;
      }).catch(console.error);
    }
  }, [timesheets, users]);
  
  useEffect(() => {
    console.log('Effect to fetch timesheets for date:', selectedDate.toString());
    fetchTimesheets(selectedDate);
    getUsers().then(setUsers).catch(console.error);
  }, []);

  const calculateWorkedHoursForTimesheet = (timesheet) => {
    console.log(`Calculating worked hours for timesheet ID ${timesheet.id}`);
    if (!timesheet.shifts || !Array.isArray(timesheet.shifts)) {
      return 0;
    }
    return timesheet.shifts.reduce((acc, shift) => {
      if (!shift.start || !shift.finish) {
        return acc;
      }
      const start = dayjs.unix(shift.start);
      const finish = dayjs.unix(shift.finish);
      const breakLength = shift.break_length || 0;
      const duration = finish.diff(start, 'minute') - breakLength;
      return acc + duration;
    }, 0) / 60;
  };

  const safeMap = (array, mapFn) => Array.isArray(array) ? array.map(mapFn) : [];

  return (
    <div>
      <WeekPickerComponent  
        selectedDate={selectedDate.toDate()}
        onDateChange={handleDateChange} 
        formatWeekRange={formatWeekRange(selectedDate)}/>
      <Table striped bordered hover
        className="timesheet-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Rostered Hours</th>
            <th>Worked Hours</th>
            <th>Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : (
            safeMap(timesheets, (timesheet) => {
                console.log('Timesheet start date before formatting:', timesheet.start);
                const formattedDate = timesheet.start ? formatWeekRange(timesheet.start) : 'Invalid Date Range';
                console.log('Timesheet formatted date:', formattedDate);
                const workedHours = calculateWorkedHoursForTimesheet(timesheet);
                const user = getUserById(timesheet.user_id);
                console.log("user:", user);
                const hourlyRate = user && user.hourly_rate ? user.hourly_rate : 0;
                console.log('hourlyRate', hourlyRate);
                const cost = calculateCost(workedHours, hourlyRate);
                console.log('workedHours', workedHours);
                console.log(`Rendering timesheet for user ID ${timesheet.user_id}`);
                console.log(`Worked Hours: ${workedHours}, Hourly Rate: ${hourlyRate}, Cost: ${cost}`);
              
                return (
                  <tr key={timesheet.id}>
                    <td onClick={() =>handleRowClick(timesheet.user_id, selectedDate.startOf('week').format('YYYY-MM-DD'), selectedDate.endOf('week').format('YYYY-MM-DD'))}>
                      <span className="username-hover" style={{ cursor: 'pointer', color: 'primary' }}>
                        {(getUserById(timesheet.user_id) && getUserById(timesheet.user_id).name) || 'N/A'}
                      </span>
                    </td>
                    <td>{formattedDate}</td>
                    <td>{timesheet.rosteredHours || 'N/A'}</td>
                    <td>{`${workedHours.toFixed(2)}h`}</td>
                    <td>{`$${cost.toFixed(2)}`}</td>
                    <td></td>
                  </tr>
                )
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ApproveTimesheetsPage;
