import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {TimePicker, DatePicker, Select} from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import '../index.css';
import '../Tailwind.css';
import { getRosterForDate, getUsers } from '../API/Utilities';
import WeekPickerComponent from '../Components/Roster&Timesheets/WeekPicker';
import { calculateHours, formatShiftTime } from '../Components/Roster&Timesheets/CalculateHours';
import DatePickerDropdown from '../Components/Roster&Timesheets/DatePickerDropdown';
import EmployeesDropdown from '../Components/Roster&Timesheets/EmployeesDropdown';
import TeamsDropdown from '../Components/Roster&Timesheets/TeamsDropdown';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import utc from 'dayjs/plugin/utc'; // for handling UTC dates
import timezone from 'dayjs/plugin/timezone'; // for handling timezones

dayjs.extend(utc);
dayjs.extend(timezone);

const Roster = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [rosterData, setRosterData] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
     // Fetch the user data using the GetUsers component
     useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
          setLoading(true);
          try {
            // Call getUsers directly, not GetUsers since we are importing it as getUsers
            const usersData = await getUsers();
            if (isMounted) {
              setUsers(usersData);
            }
          } catch (error) {
            if (isMounted) {
              setError(error.message);
            }
          } finally {
            if (isMounted) {
              setLoading(false);
            }
          }
        };
    
        fetchUsers();
        return () => { isMounted = false };
      }, []);

      const fetchRoster = async (currentUsers) => {
        setLoading(true);
        try {
          const roster = await getRosterForDate(selectedDate);
          setRosterData(formatRosterData(roster.schedules, currentUsers));
          setError(null);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        if (Object.keys(users).length > 0) {
          fetchRoster(users);
        }
        // Now this effect will re-run not only when selectedDate changes but also when users state changes
      }, [selectedDate, users]);
      
      const handleDateChange = (date) => {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setSelectedDate(formattedDate);
      };
      
      useEffect(() => {
        // Whenever selectedDate changes, this effect will re-run and fetch the roster
        // for the week that includes the selectedDate
        fetchRoster();
      }, [selectedDate]);
      
    const formatRosterData = (schedules, currentUsers) => {
        // Assuming each entry in `schedules` contains a `date` and nested `schedules`
        const userShiftMap = {};
      
        schedules.forEach(scheduleByDate => {
          scheduleByDate.schedules.forEach(schedule => {
            const start = new Date(schedule.start * 1000);
            const finish = new Date(schedule.finish * 1000);
            const dayOfWeek = dayjs(start).format('dddd').toLowerCase(); // Using dayjs for formatting
      
            if (!userShiftMap[schedule.user_id]) {
                const user = currentUsers[schedule.user_id];
                userShiftMap[schedule.user_id] = {
                    //name: user ? user.name : 'Unknown',
                    userId: schedule.user_id,
                    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
                };
            }
      
            const shiftTime = `${formatShiftTime(start)} - ${formatShiftTime(finish)}`;
            
            // Add the shift time to the appropriate day of the week
            if (userShiftMap[schedule.user_id].hasOwnProperty(dayOfWeek)) {
              userShiftMap[schedule.user_id][dayOfWeek].push(shiftTime);
            }
          });
        });
      
        // Convert the map into an array of user shifts and join the times for each day
        return Object.values(userShiftMap).map(userShifts => {
          Object.keys(userShifts).forEach(day => {
            if (day !== 'userId') {
              userShifts[day] = userShifts[day].join(', ');
            } else {
                 // Use the userId to get the user's name from the `users` state
              const user = users[userShifts.userId];
              userShifts.name = user ? user.name : 'Unknown'; // Add a name property to the userShifts object
            }
          });
          return userShifts;
        });
      };
      
    // This function will calculate the dates of the week based on selectedDate
    const getWeekDates = (selectedDate) => {
        dayjs.locale('en-gb');
        const startOfWeek = dayjs(selectedDate).startOf('week');
        return Array.from({ length: 7 }).map((_, index) =>
            startOfWeek.add(index, 'day').format('DD MMM')
        );
    };

    // Call this function to get the array of week dates
    const weekDates = getWeekDates(selectedDate);
    const dayAbbreviations = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

    return (
        <div className="roster-container ">
            <div className="flex items-center">
                <WeekPickerComponent
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                 />
            </div>
            <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-8 gap-1">
              <div className="day bg-gray-100 border p-2 rounded m-1 overflow-hidden">Staff</div>
              {dayAbbreviations.map((dayAbbrev, index) => (
                <div key={index} className="day bg-gray-100 border p-2 rounded m-1 overflow-hidden">
                  <div>{dayAbbrev}</div>
                  <div>{dayjs(weekDates[index]).format('DD MMM')}</div>
                </div>
              ))}

              {/* Body */}
              {rosterData.map((row, index) => (
                <React.Fragment key={index}>
                  <div className="day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.name}</div>
                  <div className="roster-table-font day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.monday}</div>
                  <div className="roster-table-font day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.tuesday}</div>
                  <div className="roster-table-font day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.wednesday}</div>
                  <div className="roster-table-font day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.thursday}</div>
                  <div className="roster-table-font day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.friday}</div>
                  <div className="roster-table-font day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.saturday}</div>
                  <div className="roster-table-font day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.sunday}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Display error message if any */}
      {error && <p>Error fetching roster: {error}</p>}
    </div>
  );
};

export default Roster;