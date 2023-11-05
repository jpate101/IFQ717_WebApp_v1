import { calculateHours } from "./CalculateHours";
import FormItemWrapper from "./FormItemWrapper";
import {TimePicker } from 'antd';
import dayjs from 'dayjs';

function TimePickerComponent({ shiftDetails, setShiftDetails, hoursWorked, setHoursWorked }) {

    return (
      <FormItemWrapper
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tanda-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
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