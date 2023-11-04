
import React, {useState} from 'react';
import {DatePicker, Button} from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/en_GB'

function WeekPickerComponent({onDateChange }) {

    const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
    const handleTodayButtonClick = () => {
      const today = dayjs().toDate();
      onDateChange(today);
      setSelectedDate(today);
    }

    return (
      <div className="flex justify-between items-center">
        <DatePicker.WeekPicker
          className="bg-white border p-2 rounded m-1"
          onChange={date => {
            onDateChange(date ? date.toDate() : null);
          }}
          value={selectedDate ? dayjs(selectedDate) : null}
          allowClear={false}
          showToday={null}
          format="DD MMM"
          locale={locale}
        />
        <Button onClick={handleTodayButtonClick}
        className="border p-2 rounded h-10 background text-white"
        style={{backgroundColor: '#19b3d9'}}>
          Today</Button>
      </div>
    );
}

export default WeekPickerComponent;
