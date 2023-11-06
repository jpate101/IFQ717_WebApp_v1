import { calculateHours } from "./CalculateHours";
import FormItemWrapper from "./FormItemWrapper";
import {TimePicker } from 'antd';
import { CalendarIcon } from "./RosterIcons";
import dayjs from 'dayjs';

function TimePickerComponent({ 
  shiftDetails = {startTime: '', finishTime: ''},
  setShiftDetails, 
  hoursWorked, 
  setHoursWorked }) {

    return (
      <FormItemWrapper
        icon={CalendarIcon}
      >
        <TimePicker.RangePicker
         format="HH:mm"
         suffixIcon={null}
         minuteStep={15}
         value={[
          shiftDetails.startTime ? dayjs(shiftDetails.startTime, "HH:mm") : null,
          shiftDetails.finishTime ? dayjs(shiftDetails.finishTime, "HH:mm") : null
        ]}
         onChange={dayjsValues => {
          const formattedStartTime = (dayjsValues && dayjsValues[0]) ? dayjsValues[0].format("HH:mm") : "";
          const formattedFinishTime = (dayjsValues && dayjsValues[1]) ? dayjsValues[1].format("HH:mm") : "";
          setShiftDetails(prev => ({ ...prev, startTime:formattedStartTime, finishTime: formattedFinishTime }));
          const calculatedHours = calculateHours(formattedStartTime, formattedFinishTime);
          setHoursWorked(calculatedHours)
        }}
        />
      </FormItemWrapper>
    );
  }

  export default TimePickerComponent;