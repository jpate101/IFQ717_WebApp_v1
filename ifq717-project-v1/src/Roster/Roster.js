import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import utc from 'dayjs/plugin/utc'; 
import timezone from 'dayjs/plugin/timezone';
import {
  getRosterForDate,
  getUsers, 
  getAllDepartments, 
  createSchedule, 
  deleteSchedule, 
  getScheduleById, 
  updateSchedule } from '../API/Utilities';
import WeekPickerComponent from '../Components/Roster&Timesheets/WeekPicker';
import { formatShiftTime } from '../Components/Roster&Timesheets/CalculateHours';
import AddScheduleModal from '../Components/Roster&Timesheets/AddScheduleModal';
import { PlusCircleIcon } from '../Components/Roster&Timesheets/RosterIcons';
import PublishShiftModal from '../Components/Roster&Timesheets/PublishShiftModal'

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
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentScheduleDetails, setCurrentScheduleDetails] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

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
          const teamId = schedule.department_id;
          const scheduleId = schedule.id;
          console.log("team id:", teamId);
          console.log("schedule id:", scheduleId);

          if (!userShiftMap[schedule.user_id]) {
            const user = currentUsers.find(u => u.id === schedule.user_id);
              userShiftMap[schedule.user_id] = {
                  userId: schedule.user_id,
                  monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
              };
          }
    
          const shiftTime = `${formatShiftTime(start)} - ${formatShiftTime(finish)}`;

          if (userShiftMap[schedule.user_id].hasOwnProperty(dayOfWeek)) {
            userShiftMap[schedule.user_id][dayOfWeek].push(shiftTime, teamId, scheduleId);
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


  const openModalToAddShift = (userId, dayIndex, teamId) => {
    const dateOfShift = dayjs(selectedDate).startOf('week').add(dayIndex, 'day').format('YYYY-MM-DD');
    const shift = rosterData.find(shift => shift.userId === userId && shift.date === dateOfShift);
  
    if (shift) {
      const [startTime, finishTime] = shift.shiftTime.split(' - ');
      setCurrentShiftDetails({ 
        userId, 
        date: dateOfShift, 
        startTime, 
        finishTime, 
        shiftId: shift.id,
        teamId });
    } else {
      setCurrentShiftDetails({ userId, date: dateOfShift });
    }
  
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
 
    const startDateTime = dayjs(`${currentShiftDetails.date}T${startTime}`);
    const finishDateTime = dayjs(`${currentShiftDetails.date}T${finishTime}`);
    const startTimestamp = startDateTime.unix();
    const finishTimestamp = finishDateTime.unix();
    

    const shiftForAPI = {
      user_id: employeeId.id,  
      department_id: teamId,  
      start: startTimestamp,
      finish: finishTimestamp,
    };
  
    console.log('addNewShiftToRoster shiftForAPI:', shiftForAPI);
  
    try {
      const createdShift = await createSchedule(shiftForAPI);
      console.log('Shift created:', createdShift);
  
      if (createdShift && createdShift.user_id) {
        setRosterData(currentRosterData => [...currentRosterData, createdShift]);
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
  
  const openModalWithShiftDetails = async (userId, dayIndex) => {
    console.log("Opening modal with shift details");
    console.log("Roster Data: ", rosterData);
    console.log("User ID: ", userId);
    console.log("Day Index: ", dayIndex);
    
    const dateOfShift = dayjs(selectedDate).startOf('week').add(dayIndex, 'day').format('YYYY-MM-DD');
    console.log("Date of Shift: ", dateOfShift);
  
    const userShifts = rosterData.find(row => row.userId === userId);
    console.log("User Shifts: ", userShifts);
  
    if (!userShifts) {
      console.error(`No shifts found for user ID ${userId}`);
      return;
    }
  
    const fullDayNames = [
      "monday", 
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"];

    const dayKey = fullDayNames[dayIndex];
    console.log("Day Key: ", dayKey);
  
    if (!userShifts[dayKey]) {
      console.error(`No shifts found for user ID ${userId} on ${dayKey}`);
      return;
    }
    
    console.log("Shift Data for the day: ", userShifts[dayKey]);

    const shiftData = userShifts[dayKey];

    if (!shiftData) {
      console.error(`No shift data found for user ID ${userId} on ${dayKey}`);
      return;
    }
    console.log("Raw Shift Data: ", shiftData);

    const [shiftString, teamId, scheduleIdString] = shiftData.split(', ');
    console.log("Parsed Shift String: ", shiftString);
    console.log("Parsed Team ID: ", teamId);
    const scheduleId = parseInt(scheduleIdString);

    console.log("Parsed Schedule ID: ", scheduleId);

    try {
      const scheduleDetails = await getScheduleById(scheduleId);
      setCurrentScheduleDetails(scheduleDetails);
      console.log('schedule details:', scheduleDetails)
    } catch (error) {
      console.error('Error fetching schedule details:', error);
    }

    if (!shiftString) {
      console.error(`No shift string found for user ID ${userId} on ${dayKey}`);
      return;
    }

    const [startTime, finishTime] = shiftString.split(' - ');
    console.log("Parsed Start Time: ", startTime);
    console.log("Parsed Finish Time: ", finishTime);

    if (!startTime || !finishTime) {
      console.error(`Invalid shift times for user ID ${userId} on ${dayKey}: ${shiftString}`);
      return;
    }

    const teamIdParsed = parseInt(teamId, 10);

    setCurrentShiftDetails({
       userId, 
       date: dateOfShift, 
       startTime, 
       finishTime, 
       teamId: teamIdParsed,
       shiftId: scheduleId
      });
      console.log("currentShiftDetails after update: ", currentShiftDetails);

    const selectedEmployee = users.find(user => user.id === userId);
    const selectedTeam = departments.find(department => department.id === teamIdParsed);

    setSelectedEmployee(selectedEmployee);
    setSelectedTeam(selectedTeam);

    console.log("Selected employee:", selectedEmployee);
    console.log("Selected team:", selectedTeam);

    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    await fetchRoster(users);
};

const handlePublish = async (publishOption) => {
  console.log(`Publishing option selected: ${publishOption}`);
  setIsPublishModalOpen(false);

  const startOfWeek = dayjs(selectedDate).startOf('week').unix();
  const endOfWeek = dayjs(selectedDate).endOf('week').unix();

  let shiftsToPublish = [];
  rosterData.forEach(userShifts => {
    Object.entries(userShifts).forEach(([dayKey, shiftData]) => {
      if (dayKey === 'userId' || dayKey === 'name' || !shiftData.includes(',')) {
        console.log(`Skipping non-shift data or empty shift for ${dayKey}`);
        return;
      }

      const [shiftTime, teamId, scheduleIdString] = shiftData.split(', ');
      const scheduleId = parseInt(scheduleIdString, 10);

      if (isNaN(scheduleId)) {
        console.log(`Skipping day ${dayKey} as there is no shift`);
        return;
      }

      console.log(`Found shift: Day ${dayKey}, ID: ${scheduleId}`);

      const shiftStartUnix = dayjs(`${selectedDate} ${shiftTime.split(' - ')[0]}`).unix();
      if (shiftStartUnix >= startOfWeek && shiftStartUnix <= endOfWeek) {
        shiftsToPublish.push({ id: scheduleId });
      }
    });
  });

  console.log(`Shifts found to publish:`, shiftsToPublish);

  const filteredShiftsToPublish = await Promise.all(
    shiftsToPublish.map(async (shift) => {
      const scheduleDetails = await getScheduleById(shift.id);
      const shouldPublish =
        publishOption === 'all' || 
        (publishOption === 'updates' && scheduleDetails && scheduleDetails.last_published_at === null);
      return shouldPublish ? shift : null;
    })
  );

  const shiftsToActuallyPublish = filteredShiftsToPublish.filter(shift => shift !== null);

  console.log(`Filtered shifts to be published:`, shiftsToActuallyPublish);

  if (shiftsToActuallyPublish.length > 0) {
    try {
      const publishPromises = shiftsToActuallyPublish.map(async (shift) => {
        const updatedShift = { id: shift.id, last_published_at: Math.floor(Date.now() / 1000) };
        return await updateSchedule(updatedShift);
      });
      await Promise.all(publishPromises);
      console.log('Selected shifts have been published.');
      alert('Shifts published successfully');
      fetchRoster(users);
    } catch (error) {
      console.error('Error publishing shifts:', error);
      alert('An error occurred while publishing shifts');
    }
  } else {
    console.log('No shifts to publish');
    alert('No shifts to publish');
  }
};

  const getWeekRange = () => {
    const startOfWeek = dayjs(selectedDate).startOf('week').format('DD MMM');
    const endOfWeek = dayjs(selectedDate).endOf('week').format('DD MMM');
    return `Week Range: ${startOfWeek} - ${endOfWeek}`;
  };

  const hasShiftsInSelectedWeek = () => {
    const startOfWeek = dayjs(selectedDate).startOf('week');
    const endOfWeek = dayjs(selectedDate).endOf('week');
    return rosterData.some(shift => {
      const shiftDate = dayjs(shift.date);
      return shiftDate.isAfter(startOfWeek) && shiftDate.isBefore(endOfWeek);
    });
  };
  
    return (
        <div className="roster-container ">
            <div className="flex items-center justify-between">
                <WeekPickerComponent
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                />
                <button 
                  onClick={() => {
                    if (hasShiftsInSelectedWeek()) {
                      setIsPublishModalOpen(true);
                    } else {
                      alert('No shifts to publish for the selected week.');
                    }
                  }}
                  className="border p-2 rounded background text-white h-10 -mt-2"
                  style={{backgroundColor: '#3498db'}}
                  >
                  Publish shifts
                </button>
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
                          onClose={handleModalClose}
                          scheduleDetails={currentScheduleDetails}
                          onAddShift={addNewShiftToRoster}
                          onUpdateShift={updateSchedule}
                          onDeleteShift={deleteSchedule}
                          scheduleId={currentShiftDetails.shiftId}
                          employees={usersArray}
                          teams={employeeTeams}
                          selectedEmployee={selectedEmployee}
                          selectedTeam={selectedTeam}
                          employeeId={currentShiftDetails.userId}
                          teamId={currentShiftDetails.teamId}
                          shiftDate={dayjs(currentShiftDetails.date).toDate()}
                          shiftId={currentShiftDetails.shiftId}
                          shiftStartTime={currentShiftDetails.startTime}
                          shiftFinishTime={currentShiftDetails.finishTime}
                          currentShiftDetails={currentShiftDetails}
                        />,
                        document.getElementById('modal-root')
                      )}
                      {isPublishModalOpen && ReactDOM.createPortal(
                        <PublishShiftModal
                          isOpen={isPublishModalOpen}
                          onClose={() => setIsPublishModalOpen(false)}
                          weekRange={getWeekRange()}
                          onPublish={handlePublish}
                        />,
                        document.getElementById('modal-root')
                      )}
                      <div onClick={() => openModalWithShiftDetails(row.userId, dayIndex)}>
                        {dayHours}
                      </div>
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