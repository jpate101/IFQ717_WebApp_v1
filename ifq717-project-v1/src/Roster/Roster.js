import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { getRosterForDate, getUsers, getAllDepartments, createSchedule } from '../API/Utilities';
import WeekPickerComponent from '../Components/Roster&Timesheets/WeekPicker';
import { formatShiftTime } from '../Components/Roster&Timesheets/CalculateHours';
import AddScheduleModal from '../Components/Roster&Timesheets/AddScheduleModal';
import { PlusCircleIcon } from '../Components/Roster&Timesheets/RosterIcons';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import utc from 'dayjs/plugin/utc'; 
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const Roster = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [rosterData, setRosterData] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentShiftDetails, setCurrentShiftDetails] = useState({ userId: null, date: null });
    const [departments, setDepartments] = useState([]);
    const [employeeTeams, setEmployeeTeams] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
      if (currentShiftDetails.userId) {
        const employee = users.find(u => u.id === currentShiftDetails.userId);
        setSelectedEmployee(employee);
      }
    }, [currentShiftDetails, users]);

     useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
          setLoading(true);
          try {
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

      useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const departmentsData = await getAllDepartments();
                console.log('Departments fetched:', departmentsData);
                setDepartments(departmentsData);
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            }
        };
    
        fetchDepartments();
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
      }, [selectedDate, users]);
      
      const handleDateChange = (date) => {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setSelectedDate(formattedDate);
      };
      
      useEffect(() => {
        fetchRoster();
      }, [selectedDate]);
      
    const formatRosterData = (schedules, currentUsers) => {
        const userShiftMap = {};
      
        schedules.forEach(scheduleByDate => {
          scheduleByDate.schedules.forEach(schedule => {
            const start = new Date(schedule.start * 1000);
            const finish = new Date(schedule.finish * 1000);
            const dayOfWeek = dayjs(start).format('dddd').toLowerCase();
      
            if (!userShiftMap[schedule.user_id]) {
              const user = currentUsers.find(u => u.id === schedule.user_id);
                userShiftMap[schedule.user_id] = {
                    userId: schedule.user_id,
                    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
                };
            }
      
            const shiftTime = `${formatShiftTime(start)} - ${formatShiftTime(finish)}`;
            
            if (userShiftMap[schedule.user_id].hasOwnProperty(dayOfWeek)) {
              userShiftMap[schedule.user_id][dayOfWeek].push(shiftTime);
            }
          });
        });
      
        return Object.values(userShiftMap).map(userShifts => {
          Object.keys(userShifts).forEach(day => {
            if (day !== 'userId' && day !== 'name') {
              userShifts[day] = userShifts[day].join(', ');
            } else {
              const user = currentUsers.find(u => u.id === userShifts.userId);
              userShifts.name = user ? user.name : 'Unknown';
            }
          });
          return userShifts;
        });
      };
      
    const getWeekDates = (selectedDate) => {
        dayjs.locale('en-gb');
        const startOfWeek = dayjs(selectedDate).startOf('week');
        return Array.from({ length: 7 }).map((_, index) =>
            startOfWeek.add(index, 'day').format('DD MMM')
        );
    };

    const weekDates = getWeekDates(selectedDate);
    const dayAbbreviations = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];


const openModalToAddShift = (userId, dayIndex) => {
  const dateOfShift = dayjs(selectedDate).startOf('week').add(dayIndex, 'day').format('YYYY-MM-DD');

  console.log(`Opening modal for userId ${userId} and date ${dateOfShift}`);
  setCurrentShiftDetails({ userId, date: dateOfShift });
  setIsModalOpen(true);
};  

    useEffect(() => {
      console.log("isModalOpen:",isModalOpen);
    }, [isModalOpen]);

    const usersArray = Object.values(users);

    useEffect(() => {
      if (users.length > 0) {
          fetchRoster(users);
      }
  }, [selectedDate, users]);

  const addNewShiftToRoster = async (shiftDetails) => {
    console.log('addNewShiftToRoster shiftDetails:', shiftDetails);
    

    const { employeeId, teamId, startTime, finishTime } = shiftDetails;
    console.log('Start Time:', startTime, 'Finish Time:', finishTime);

    if (!employeeId || !teamId || !startTime || !finishTime) {
      console.error('Missing shift details:', shiftDetails);
      return;
    }
  
    const startDateTime = dayjs(`${currentShiftDetails.date}T${shiftDetails.startTime}`);
    const finishDateTime = dayjs(`${currentShiftDetails.date}T${shiftDetails.finishTime}`);

    const startTimestamp = startDateTime.unix();
    const finishTimestamp = finishDateTime.unix();
    
    const shiftForAPI = {
      user_id: employeeId,
      department_id: teamId,
      start: startTimestamp,
      finish: finishTimestamp,
    };
  
    console.log('addNewShiftToRoster shiftForAPI:', shiftForAPI);
  
    try {
      const createdShift = await createSchedule(shiftForAPI);
      console.log('Shift created:', createdShift);
  
      if (createdShift && createdShift.user_id) {
        setRosterData((currentRosterData) => {
          const updatedRosterData = [...currentRosterData];
          return updatedRosterData;
        });
  
        alert('Shift saved successfully!');
        setIsModalOpen(false);
        fetchRoster(users);
      } else {
        console.error('Unexpected response from createSchedule:', createdShift);
      }
    } catch (error) {
      console.error('Error creating shift:', error);
    }
  };

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

              {rosterData.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.name}</div>
                  {[row.monday, row.tuesday, row.wednesday, row.thursday, row.friday, row.saturday, row.sunday].map((dayHours, dayIndex) => (
                    <div key={dayIndex} className="roster-table-font day p-2 rounded m-1 overflow-hidden relative">
                      <div className="flex flex-col items-center justify-center">
                      <PlusCircleIcon
                        className="cursor-pointer hover:text-primary mb-2"
                        onClick={() => openModalToAddShift(row.userId, dayIndex)}
                      >
                      </PlusCircleIcon>
                      {isModalOpen && ReactDOM.createPortal(
                        <AddScheduleModal
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onAddShift={addNewShiftToRoster}
                          employees={usersArray}
                          teams={employeeTeams}
                          selectedEmployee={selectedEmployee}
                          shiftDate={dayjs(currentShiftDetails.date).toDate()}
                        />,
                        document.getElementById('modal-root')
                      )}
                        {dayHours}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p>Error fetching roster: {error}</p>}
    </div>
  );
};

export default Roster;