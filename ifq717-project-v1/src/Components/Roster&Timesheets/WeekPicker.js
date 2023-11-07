
import React from 'react';
import {DatePicker, Button} from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/en_GB'

function WeekPickerComponent({ selectedDate, onDateChange }) {

    const handleTodayButtonClick = () => {
        const today = dayjs().toDate();
        onDateChange(today);
    }

  return (
      <div className="flex items-center -ml-0.5 pb-2">
          <DatePicker.WeekPicker
              className="bg-white border p-2 rounded m-1 h-10"
              onChange={date => {
                  onDateChange(date ? date.toDate() : null);
              }}
              value={dayjs(selectedDate)} // Use the selectedDate from props
              allowClear={false}
              showToday={false}
              format="DD MMM"
              locale={locale}
          />
          <Button onClick={handleTodayButtonClick}
          className="border p-2 rounded background text-white h-10"
          style={{backgroundColor: '#3498db'}}>
              Today
          </Button>
      </div>
  );
}


export default WeekPickerComponent;
