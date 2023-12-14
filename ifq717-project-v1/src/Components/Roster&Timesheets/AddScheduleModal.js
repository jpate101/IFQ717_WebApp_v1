import React, { useState, useEffect } from 'react';
import EmployeesDropdown from './EmployeesDropdown';
import TeamsDropdown from './TeamsDropdown';
import DateFormItem from './DateFormItem';
import TimePickerComponent from './TimePicker';
import { getUsers, getAllDepartments } from '../../API/Utilities';
import { ReactComponent as BinIcon } from '../../svg/trash3.svg';
//import { ReactComponent as DotDotDot } from '../../svg/three-dots.svg';
import { ReactComponent as Repeat } from '../../svg/arrow-repeat.svg';
import { ReactComponent as Person } from '../../svg/person-circle.svg';
import { Tooltip } from 'antd';
import MultipleDatePicker from './RepeatShift';
import dayjs from 'dayjs';

const RosterModal = ({ 
  isOpen,
  onClose,
  onAddShift,
  onUpdateShift,
  onDeleteShift,
  shiftDate,
  shiftStartTime,
  shiftFinishTime,
  employeeId,
  teamId,
  scheduleId,
  currentShiftDetails,
}) => {

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [users, setUsers] = useState(null);
  const [hoursWorked, setHoursWorked] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [showRepeatDatePicker, setShowRepeatDatePicker] = useState(false);  
  const [shiftDetails, setShiftDetails] = useState({
    startTime: '',
    finishTime: '',
    employeeId:'',
    teamId:'',
    scheduleId:''
  });

  useEffect(() => {
    if (shiftStartTime && shiftFinishTime) {
      setShiftDetails({
        startTime: shiftStartTime,
        finishTime: shiftFinishTime,
      });
    }
  }, [shiftStartTime, shiftFinishTime]);

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching departments...");
      const departments = await getAllDepartments();
      console.log("Departments fetched:", departments);
      setAllTeams(departments);
  
      if (teamId) {
        const team = departments.find(dept => dept.id === teamId);
        console.log("Selected team (from teamId):", team);
        setSelectedTeam(team);
      }
  
      if (employeeId) {
        console.log("Fetching user data for employeeId:", employeeId);
        const userResponse = await getUsers(employeeId);
        console.log("User response:", userResponse);
  
        if (userResponse && userResponse.length > 0) {
          const specificUser = userResponse[0];
          setUsers([specificUser]);
          setSelectedEmployee(specificUser);
  
          const employeeTeams = departments.filter(team =>
            specificUser.department_ids.includes(team.id)
          );
          console.log("Teams associated with the employee:", employeeTeams);
          setTeams(employeeTeams);
  
          if (teamId) {
            const selectedTeam = employeeTeams.find(team => team.id === teamId);
            console.log("Selected team (from employee's teams):", selectedTeam);
            setSelectedTeam(selectedTeam);
          }
        }
      } else {
        const allUsers = await getUsers();
        console.log("All users fetched:", allUsers);
        setUsers(allUsers);
      }
    }
  
    fetchData();
  }, [teamId, employeeId]);
  
  const selectedEmployeeName = selectedEmployee ? selectedEmployee.name : null;

  const handleSaveShift = async () => {

    console.log('Received shiftDate:', shiftDate);

    const startDateTime = dayjs(`${dayjs(shiftDate).format('YYYY-MM-DD')}T${shiftDetails.startTime}`);
    const finishDateTime = dayjs(`${dayjs(shiftDate).format('YYYY-MM-DD')}T${shiftDetails.finishTime}`);
    console.log('Parsed startDateTime:', startDateTime.toString());
    console.log('Parsed finishDateTime:', finishDateTime.toString());
    console.log('Shift details for start and finish:', shiftDetails);
    
    const newShiftDetails = {
      scheduleId: currentShiftDetails.scheduleId,
      employeeId: selectedEmployee,
      teamId: selectedTeam,
      startTime: startDateTime.format('HH:mm'),
      finishTime: finishDateTime.format('HH:mm'),
    };
  
    setShiftDetails(newShiftDetails);

    console.log('setShiftDetails(newShiftDetails):', newShiftDetails);
  
    try {
      if (currentShiftDetails && currentShiftDetails.shiftId) {
        // Existing shift, update it
        const updatedShift = {
          id: currentShiftDetails.shiftId,
          user_id: selectedEmployee.id,
          department_id: selectedTeam.id,
          start: startDateTime.unix(),
          finish: finishDateTime.unix(),
        };

        await onUpdateShift(updatedShift);
        alert('Shift updated successfully!');
      } else {
        // New shift, create it
        await onAddShift(newShiftDetails);
        alert('Shift created successfully!');
      }
      onClose();
  } catch (error) {
      console.error('Error saving/updating shift:', error);
  }
};

const handleDeleteShift = async () => {
  console.log("Deleting schedule with ID:", scheduleId);
  try {
    await onDeleteShift(scheduleId);
    alert('Shift deleted successfully!');
    onClose();
  } catch (error) {
    console.error('Error deleting shift:', error);
  }
};

useEffect(() => {
    console.log("Current Schedule ID in Modal: ", scheduleId);
}, [scheduleId]);

const handleTeamChange = (newTeamId) => {
  console.log(`Team changed to: ${newTeamId}`);
  const newSelectedTeam = allTeams.find(team => team.id === parseInt(newTeamId, 10));
  setSelectedTeam(newSelectedTeam);
};

const isUpdatingShift = currentShiftDetails && currentShiftDetails.shiftId;

const handleRepeatClick = () => {
  setShowRepeatDatePicker(!showRepeatDatePicker);
};

const handleDatesSelected = (dates) => {
  setSelectedDates(dates);
};

useEffect(() => {
  if (shiftDate) {
    console.log("Creating/updating shift for date:", shiftDate);
  }
}, [shiftDate]);

  return isOpen && (
    <>
      <div className="fixed  bg-black bg-opacity-10 inset-0 flex justify-center items-center">
      <div className="relative bg-white p-5 rounded-lg h-auto max-h-[80vh] ">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold cursor-pointer"
        >
          &times;
        </button>
        <div className="my-2">
          <DateFormItem
            shiftDate={shiftDate}
          >
          </DateFormItem>
        </div>
        <div className="my-2">
          <TimePickerComponent
            shiftDetails={shiftDetails}
            setShiftDetails={setShiftDetails}
            hoursWorked={hoursWorked}
            setHoursWorked={setHoursWorked}
          >
          </TimePickerComponent>
        </div>
        <div className="my-2">
          <EmployeesDropdown
            onSelectChange={() => {}}
            selectedEmployeeId={selectedEmployeeName}
            employees={users}
          >
          </EmployeesDropdown>
        </div>
        <div className="my-2">
          <TeamsDropdown
            teams={teams}
            onSelectChange={handleTeamChange}
            selectedTeamId={selectedTeam ? selectedTeam.id : null}
          >
          </TeamsDropdown>
        </div>
        {showRepeatDatePicker && (
          
            <MultipleDatePicker onDatesSelected={handleDatesSelected}/>
          )}
        <div className="flex justify-between my-2">
          <div>{}</div>
          <div className="my-2 flex items-center"
            style={{ marginTop: '10px' }}
            >
            <Tooltip title="Repeat shift" placement="bottom" color="#3498db">
              <Repeat 
                onClick={handleRepeatClick}
                className="tanda-icon cursor-pointer mr-2" // Adjust spacing as needed
              />
            </Tooltip>
            <Tooltip title="View staff profile" placement="bottom" color="#3498db">
              <Person className="tanda-icon cursor-pointer"/>
            </Tooltip>
            {isUpdatingShift && (
            <Tooltip title="Delete shift" placement="bottom" color="#3498db">
              <BinIcon
                onClick={handleDeleteShift}
                className="w-6 h-6 mr-3 cursor-pointer roster-icon"
              />
            </Tooltip>

          )}
          <button
            onClick={handleSaveShift}
            className="tanda-button px-3 py-2"
            style={{
              fontSize: '0.875rem'
          }}
          >
            {isUpdatingShift ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  </div>
    </>
)}

export default RosterModal;