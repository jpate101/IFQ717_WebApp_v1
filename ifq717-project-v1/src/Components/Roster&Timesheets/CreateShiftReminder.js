import React, { useState } from 'react';
import { Select } from 'antd';
import FormItemWrapper from './FormItemWrapper';
import { createShiftReminder } from '../../API/Utilities';
import { ReactComponent as BellIcon } from '../../svg/bell.svg';

const { Option } = Select;

const CreateShiftReminder = ({ onReminderCreated }) => {
    const [reminderTime, setReminderTime] = useState(); // Start without a default time
  
    const handleCreateReminder = async (minutesBeforeShift) => {
      try {
        const reminderResponse = await createShiftReminder({ minutes_before_shift_start: minutesBeforeShift });
        console.log('Shift reminder created:', reminderResponse);
        onReminderCreated(reminderResponse); // Pass the reminder data back up to the parent component
      } catch (error) {
        console.error('Error creating shift reminder:', error);
      }
    };
  
    const handleSelectChange = (value) => {
      setReminderTime(value);
      handleCreateReminder(value); // Call the function when the user selects a time
    };

  return (
    <FormItemWrapper>
        <BellIcon
            className="tanda-icon"
        >
        </BellIcon>
        <Select
          style={{ 
            width: '218px',
          }}
            value={reminderTime}
            onChange={handleSelectChange}
            placeholder="Set Shift Reminder"
            allowClear
        >
            {Array.from({ length: (1435 - 5) / 5 + 1 }, (_, i) => 5 + i * 5).map((minutes) => (
          <Option value={minutes} key={minutes}>{minutes} minutes before</Option>
        ))}
        </Select>
    </FormItemWrapper>
  );
};

export default CreateShiftReminder;
