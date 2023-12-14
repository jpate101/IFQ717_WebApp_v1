import React, { useState } from 'react';
import DatePicker from 'react-multi-date-picker';

import { ReactComponent as Repeat } from '../../svg/arrow-repeat.svg';
import FormItemWrapper from './FormItemWrapper';

const MultipleDatePicker = ({ onDatesSelected }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (dates) => {
    const dateStrings = dates.map(date => date.format('YYYY-MM-DD'));
    setSelectedDates(dateStrings);
    onDatesSelected(dateStrings); 
    console.log("Selected dates:", dateStrings);
};


  return (
    <div>
      <FormItemWrapper>
        <Repeat className="tanda-icon"></Repeat>
        <DatePicker
          multiple
          format="YYYY-MM-DD"
          value={selectedDates.map(date => new Date(date))}
          onChange={handleDateChange}
          calendarPosition="bottom"
          calendarClassName="custom-calendar"
          style={{
            height: '31px',
            padding: '5px 12px',
            fontSize: '14px',
            width: '218px'
          }}
        />
         
      </FormItemWrapper>
    </div>
  );
};

export default MultipleDatePicker;
