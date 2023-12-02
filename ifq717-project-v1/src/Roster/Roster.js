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
import SelectEmployeeModal from '../Components/Roster&Timesheets/SelectEmployeeModal';
dayjs.extend(utc);

dayjs.extend(timezone);

const Roster = () => {

  console.log('Roster Component Mounted');

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
  const [isSelectEmployeeModalOpen, setIsSelectEmployeeModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [currentShiftForModal, setCurrentShiftForModal] = useState(null);

  useEffect(() => {
    console.log('useEffect for [currentShiftDetails, users]');
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

  useEffect(() => {
    console.log('useEffect triggered for [selectedDate, users, departments]')
  if (departments.length > 0 && Object.keys(users).length > 0) {
    fetchRoster(users, departments);
  }
}, [selectedDate, users, departments]); 

    const fetchRoster = async (currentUsers, currentDepartments) => {
      setLoading(true);
      try {
        const roster = await getRosterForDate(selectedDate);
        setRosterData(formatRosterData(roster.schedules, currentUsers, currentDepartments));
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
          const team = departments.find(dept => dept.id === teamId);
          const teamName = team ? team.name : 'Unknown Team';
    
          if (!userShiftMap[schedule.user_id]) {
            const user = currentUsers.find(u => u.id === schedule.user_id);
            userShiftMap[schedule.user_id] = {
              userId: schedule.user_id,
              name: user ? user.name : 'Unknown',
              shiftDetails: {},
              monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
            };
          }
    
          const shiftTime = `${formatShiftTime(start)} - ${formatShiftTime(finish)}`;
    
          if (!userShiftMap[schedule.user_id].shiftDetails[dayOfWeek]) {
            userShiftMap[schedule.user_id].shiftDetails[dayOfWeek] = [];
          }
    
          userShiftMap[schedule.user_id].shiftDetails[dayOfWeek].push({
            time: shiftTime,
            teamName,
            scheduleId
          });
        });
      });
    
      return Object.values(userShiftMap).map(userShifts => {
        Object.entries(userShifts.shiftDetails).forEach(([day, shifts]) => {
          userShifts[day] = shifts.map(shift => `${shift.time}, ${shift.teamName}`).join(', ');
        });
    
        return {
          userId: userShifts.userId,
          name: userShifts.name,
          ...userShifts.shiftDetails
        };
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
        startTime: shift ? startTime : null, 
        finishTime: shift ? finishTime : null,
        shiftId: shift ? shift.id : null,
        teamId });
    } else {
      setCurrentShiftDetails({ userId, date: dateOfShift });
    }
  
    if (userId === null) {
      setCurrentShiftDetails({ userId, date: dayjs(selectedDate).startOf('week').add(dayIndex, 'day').format('YYYY-MM-DD') });
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
    console.log('Preparing to add/update shift with details:', shiftDetails);
  
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
      department_id: teamId.id, 
      start: startTimestamp,
      finish: finishTimestamp,
    };
  
    console.log('addNewShiftToRoster shiftForAPI:', shiftForAPI);
  
    try {
      const createdShift = await createSchedule(shiftForAPI);
      console.log('Shift created response:', createdShift);
  
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
  
    const shiftDetailsForDay = userShifts[dayKey];

  if (!shiftDetailsForDay || shiftDetailsForDay.length === 0) {
    console.error(`No shifts found for user ID ${userId} on ${dayKey}`);
    return;
  }

  const firstShiftForDay = shiftDetailsForDay[0];

  const selectedEmployee = users.find(user => user.id === userId);
  const selectedTeam = departments.find(department => department.name === firstShiftForDay.teamName.trim());
  const teamId = selectedTeam ? selectedTeam.id : null;

  setCurrentShiftDetails({
    userId,
    date: dayjs(selectedDate).startOf('week').add(dayIndex, 'day').format('YYYY-MM-DD'),
    startTime: firstShiftForDay.time.split(' - ')[0],
    finishTime: firstShiftForDay.time.split(' - ')[1],
    teamId,
    shiftId: firstShiftForDay.scheduleId
  });

  setSelectedEmployee(selectedEmployee);
  setSelectedTeam(selectedTeam);

  setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    console.log('Closing Modal');
    setIsModalOpen(false);
    await fetchRoster(users);
  };

  const openPublishModal = (data) => {
    console.log('handleOpenPublishModal Called');
    if (!isPublishModalOpen) {
      setModalData(data);
      console.log('Opening Publish Shift Modal');
      setIsPublishModalOpen(true);
    }
  };
  

  const handlePublish = async (publishOption) => {
    console.log(`Publishing option selected: ${publishOption}`);
    setIsPublishModalOpen(false);

    const startOfWeek = dayjs(selectedDate).startOf('week').unix();
    const endOfWeek = dayjs(selectedDate).endOf('week').unix();

    let shiftsToPublish = [];

    rosterData.forEach(userShifts => {
      Object.entries(userShifts).forEach(([dayKey, shifts]) => {
        if (['userId', 'name'].includes(dayKey)) {
          return;
        }

        if (Array.isArray(shifts)) {
          shifts.forEach(shift => {
            if (shift && shift.scheduleId && !isNaN(shift.scheduleId)) {
              shiftsToPublish.push({ id: shift.scheduleId });
            }
          });
        } else {
          console.error(`Unexpected shift data format for ${dayKey}:`, shifts);
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

    return rosterData.some(shift => shift.userId);
  };
  
  const handleOpenSelectEmployeeModal = () => {
    setIsSelectEmployeeModalOpen(true);
  };

  const handleEmployeeSelect = employeeId => {
    const selectedEmployee = users.find(user => user.id === employeeId);
    if (selectedEmployee) {
      const newEmployeeShift = {
        userId: selectedEmployee.id,
        name: selectedEmployee.name,
        monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '',
      };
  
      setRosterData([...rosterData, newEmployeeShift]);
    }
    setIsSelectEmployeeModalOpen(false);
  };

    return (
      <div className="roster-container">
        <div className="flex items-center justify-between">
          <WeekPickerComponent
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
          <button 
            onClick={() => {
              console.log('Publish Shift Button Clicked');
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
                  <div
                    className="day bg-gray-100 border p-2 rounded m-1 overflow-hidden">
                      Staff
                  </div>
                  {dayAbbreviations.map((dayAbbrev, index) => (
                    <div 
                      key={index}
                      className="day bg-gray-100 border p-2 rounded m-1 overflow-hidden">
                      <div>
                        {dayAbbrev}
                      </div>
                      <div>
                        {dayjs(weekDates[index]).format('DD MMM')}
                      </div>
                    </div>
                  ))}
                {rosterData.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <div className="day bg-gray-100 border p-2 rounded m-1 overflow-hidden">{row.name}</div>
                    {[row.monday, row.tuesday, row.wednesday, row.thursday, row.friday, row.saturday, row.sunday].map((shifts, dayIndex) => (
                      <div key={dayIndex} className="roster-table-font day p-2 rounded m-1 overflow-hidden relative">
                        <div className="flex flex-col items-center justify-center">
                        {(!shifts || shifts.length === 0) && (
                          <PlusCircleIcon
                            className="cursor-pointer hover:text-primary mb-2"
                            onClick={() => openModalToAddShift(row.userId, dayIndex)}>
                          </PlusCircleIcon>
                        )}
                        {shifts && shifts.length > 0 && shifts.map((shift, shiftIndex) => (
                        <div onClick={() => openModalWithShiftDetails(row.userId, dayIndex)}>
                          {Array.isArray(shifts) ? shifts.map((shift, shiftIndex) => (
                            <div key={shiftIndex} className="text-center shift-container">
                              <div className= "shift-container shift-details">
                                {shift.time}
                              </div>
                              <div className="shift-details shift-container">
                                {shift.teamName}
                              </div>
                            </div>
                          )) : <div></div>}
                        </div>
                        ))}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
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
                data={modalData}
              />,
              document.getElementById('modal-root')
            )}
          </div>
        </div>
      )}
    </div>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center',
      margin: '20px 0'
      }}>
      <button 
        onClick={handleOpenSelectEmployeeModal}
        className="border p-2 rounded background text-white h-10 -mt-2"
        style={{
          backgroundColor: '#3498db',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          cursor: 'pointer' }}
        >
          Add Shifts
      </button>
    </div>
        {isSelectEmployeeModalOpen && (
          <SelectEmployeeModal
            isOpen={isSelectEmployeeModalOpen}
            onClose={() => setIsSelectEmployeeModalOpen(false)}
            employees={users}
            onEmployeeSelect={handleEmployeeSelect}
          />
        )}
      {error && <p>Error fetching roster: {error}</p>}
    </div>
  );
};

export default Roster;