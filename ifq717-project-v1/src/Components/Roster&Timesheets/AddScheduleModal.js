import React, { useState, useEffect } from 'react';
import { Modal, Button, TimePicker } from 'antd';
import EmployeesDropdown from './EmployeesDropdown';
import TeamsDropdown from './TeamsDropdown';
import { getAllDepartments, getUserInfo } from '../../API/Utilities';
import dayjs from 'dayjs';
import { CalendarIcon } from './RosterIcons';

// This function assumes you have a state in the Roster component for selectedDate, selectedEmployee, etc.

const AddShiftModal = ({ isOpen, onClose, employees, teams, onAddShift }) => {
  const [startTime, setStartTime] = useState(dayjs());
  const [finishTime, setFinishTime] = useState(dayjs());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [employeeTeams, setEmployeeTeams] = useState([]); 
  
  // Sort employees alphabetically by name before passing to EmployeesDropdown
  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name));
  
 // Effect to handle initial employee selection when the modal opens
 useEffect(() => {
  if (selectedEmployeeId && employees.length > 0) {
    handleEmployeeChange(selectedEmployeeId);
  }
}, [selectedEmployeeId, employees]);

// Now your handleEmployeeChange doesn't need to be async and won't fetch again
const handleEmployeeChange = (value) => {
  console.log(`Employee selected:`, value); // Log selected employee
  setSelectedEmployeeId(value);
  // Here you assume that departments are already filtered and passed as `teams`
  setEmployeeTeams(teams);
};
// ...

  


  const handleTeamChange = value => {
    setSelectedTeamId(value);
  };

  // Handler for TimePicker components
  const handleStartTimeChange = time => {
    setStartTime(time);
  };

  const handleFinishTimeChange = time => {
    setFinishTime(time);
  };

  const handleAddShift = () => {
    // Here you would send the data to your backend or state manager

    console.log('Adding shift with the following details:', { // Log shift details
      date: selectedDate,
      employeeId: selectedEmployeeId,
      teamId: selectedTeamId,
      startTime: startTime.format('HH:mm'),
      finishTime: finishTime.format('HH:mm'),
    });

    onAddShift({
      date: selectedDate, // Assuming you pass this as a prop
      employeeId: selectedEmployeeId,
      teamId: selectedTeamId,
      startTime: startTime.format('HH:mm'),
      finishTime: finishTime.format('HH:mm'),
    });
    onClose();
  };

  return (
    <Modal
      title="Add Shift"
      open={isOpen}
      onOk={handleAddShift}
      onCancel={onClose}
      className="top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 "
      styles={{
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.05)' }
      }}
      footer={[
        <Button key="back" onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>,
        <Button
        key="submit"
        type="primary"
        onClick={handleAddShift}
        className="bg-white text-tandaBlue rounded border-2 border-tandaBlue tandaBlue hover:bg-tandaBlue hover:text-white">
          Save
        </Button>,
      ]}

      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="my-2">
        <div 
        style={{ marginBottom: 18, width: 258 }}>
          <TimePicker.RangePicker
            value={startTime}
            onChange={handleStartTimeChange}
            format="HH:mm"
            minuteStep={15}
            placeholder={['Start Time', 'Finish Time']}
            className="ml-10 top-2"
            size="small"
          />
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <EmployeesDropdown
          employees={sortedEmployees}
          onSelectChange={handleEmployeeChange}
          selectedEmployeeId={selectedEmployeeId}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <TeamsDropdown
          teams={employeeTeams} // Gets filtered teams specific to the selected employee
          onSelectChange={handleTeamChange}
          employeeTeams={teams}
        />
      </div>
    </Modal>
  );
};

export default AddShiftModal;
