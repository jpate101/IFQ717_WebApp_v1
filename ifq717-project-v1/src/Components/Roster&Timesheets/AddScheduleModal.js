import React, { useState, useEffect } from 'react';
import EmployeesDropdown from './EmployeesDropdown';
import TeamsDropdown from './TeamsDropdown';
import DateFormItem from './DateFormItem';
import TimePickerComponent from './TimePicker';
import { getUsers, getAllDepartments } from '../../API/Utilities';
import { ReactComponent as BinIcon } from '../../svg/trash3.svg';
import { ReactComponent as DotDotDot } from '../../svg/three-dots.svg';
import dayjs from 'dayjs';
const RosterModal = ({ isOpen, onClose, onAddShift, shiftDate }) => {

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [hoursWorked, setHoursWorked] = useState('');
  const [shiftDetails, setShiftDetails] = useState({
    startTime: '',
    finishTime: '',
  });

  useEffect(() => {
    getAllDepartments().then(setAllTeams);
  }, []);

  const handleEmployeeSelect = async (employeeId) => {
    console.log('handleEmployeeSelect called with employeeId:', employeeId);

    const users = await getUsers();
    console.log('Fetched users:', users);
    
    const employee = users.find(user => user.id === employeeId);
    console.log('Found employee:', employee);
  
    if (employee) {
      const employeeTeams = allTeams.filter(team => employee.department_ids.includes(team.id));
      console.log('Employee teams:', employeeTeams);

      setTeams(employeeTeams);
    } else {
      console.log('No employee found, clearing teams');
      setTeams([]);
    }

    setSelectedEmployee(employeeId);
    console.log('setSelectedEmployee:', employeeId);
  };

  const handleSaveShift = async () => {

    console.log('Received shiftDate:', shiftDate);

    const startDateTime = dayjs(`${dayjs(shiftDate).format('YYYY-MM-DD')}T${shiftDetails.startTime}`);
    const finishDateTime = dayjs(`${dayjs(shiftDate).format('YYYY-MM-DD')}T${shiftDetails.finishTime}`);
    console.log('Parsed startDateTime:', startDateTime.toString());
    console.log('Parsed finishDateTime:', finishDateTime.toString());
    console.log('Shift details for start and finish:', shiftDetails);
    
    const newShiftDetails = {
      employeeId: selectedEmployee,
      teamId: selectedTeam,
      startTime: startDateTime.format('HH:mm'),
      finishTime: finishDateTime.format('HH:mm'),
    };
  
    console.log('New shift details being sent:', newShiftDetails);
  
    try {
      await onAddShift(newShiftDetails);
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
          onSelectChange={handleEmployeeSelect}
          selectedEmployeeId={selectedEmployee}
        >
        </EmployeesDropdown>
        </div>
        <div className="my-2">
          <TeamsDropdown
            teams={teams}
            onSelectChange={setSelectedTeam}
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
              //onClick={handleDeleteShift}
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


