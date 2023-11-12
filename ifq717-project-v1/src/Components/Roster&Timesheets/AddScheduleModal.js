import React, { useState, useEffect } from 'react';
import EmployeesDropdown from './EmployeesDropdown';
import TeamsDropdown from './TeamsDropdown';
import DateFormItem from './DateFormItem';
import TimePickerComponent from './TimePicker';
import { getUsers, getAllDepartments, updateSchedule } from '../../API/Utilities';
import { ReactComponent as BinIcon } from '../../svg/trash3.svg';
import { ReactComponent as DotDotDot } from '../../svg/three-dots.svg';
import dayjs from 'dayjs';
const RosterModal = ({ 
  isOpen,
  onClose,
  onAddShift,
  onDeleteShift,
  shiftDate,
  shiftStartTime,
  shiftFinishTime,
  employeeId,
  teamId,
  shiftId,
  currentShiftDetails,
  onUpdateShift

}) => {

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [users, setUsers] = useState(null);
  const [hoursWorked, setHoursWorked] = useState('');
  const [shiftDetails, setShiftDetails] = useState({
    startTime: '',
    finishTime: '',
    employeeId:'',
    teamId:''
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
    console.log('handleSaveShift - Received currentShiftDetails:', currentShiftDetails)
  
    const startDateTime = dayjs(`${dayjs(shiftDate).format('YYYY-MM-DD')}T${shiftDetails.startTime}`);
    const finishDateTime = dayjs(`${dayjs(shiftDate).format('YYYY-MM-DD')}T${shiftDetails.finishTime}`);
  
    const shiftData = {
      shiftId: currentShiftDetails.shiftId,
      user_id: selectedEmployee.id,
      department_id: selectedTeam.id || selectedTeam,
      start: startDateTime.unix(),
      finish: finishDateTime.unix(),
    };
  
    console.log('handleSaveShift - Prepared shiftData:', shiftData);

    try {
      if (shiftData.shiftId) {
        // Existing shift, update it
        await onUpdateShift(shiftData);
      } else {
        // New shift, create it
        await onAddShift(shiftData);
      }
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  };  
  
  return isOpen && (
    <>
      <div className="fixed bg-black bg-opacity-10 inset-0 flex justify-center items-center">
      <div className="relative bg-white p-5 rounded-lg h-auto max-h-[80vh] overflow-y-auto">
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
            onSelectChange={setSelectedTeam}
            selectedTeamId={selectedTeam ? selectedTeam.id : null}
          >
          </TeamsDropdown>
        </div>
        <div className="flex justify-between my-2">
          <div>{}</div>
          <div className="flex items-center"
            style={{ marginTop: '10px' }}
            >
            <DotDotDot
              //onClick={() => setIsDotDotDotModalOpen(true)}
              className="w-6 h-6 mr-3 cursor-pointer roster-icon"
            >
            </DotDotDot>
            <BinIcon
              //onClick={}
              className="w-6 h-6 mr-3 cursor-pointer roster-icon"
            >
            </BinIcon>
          <button
            onClick={handleSaveShift}
            className="save-button px-4 py-2 rounded border-2 ">
              Save
          </button>
        </div>
      </div>
    </div>
  </div>
    </>
)}


export default RosterModal;


