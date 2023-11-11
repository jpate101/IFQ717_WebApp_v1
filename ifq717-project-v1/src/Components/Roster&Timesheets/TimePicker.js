import { calculateHours } from "./CalculateHours";
import FormItemWrapper from "./FormItemWrapper";
import {TimePicker } from 'antd';
import { ReactComponent as ClockIcon } from '../../svg/clock.svg'
import dayjs from 'dayjs';

function TimePickerComponent({ 
  shiftDetails = {startTime: '', finishTime: ''},
  setShiftDetails, 
  hoursWorked, 
  setHoursWorked }) {

    const customStyle = {
      width: '218px',
      height: '33px'
    };

    const rowStyle = {
      display: 'flex',
      alignItems: 'center'
    };

    const clockIconStyle = {
      transform: 'translateY(-2px) translateX(-1px)',
    };

    return (
      <FormItemWrapper>
        <div style={rowStyle}>
          <ClockIcon
            className="tanda-icon"
            style={clockIconStyle}
          >
          </ClockIcon>
          <TimePicker.RangePicker
          format="HH:mm"
          style={customStyle}
          suffixIcon={null}
          minuteStep={15}
          value={[
            shiftDetails.startTime ? dayjs(shiftDetails.startTime, "HH:mm") : null,
            shiftDetails.finishTime ? dayjs(shiftDetails.finishTime, "HH:mm") : null
          ]}
          onChange={dayjsValues => {
            console.log('TimePicker values:', dayjsValues);
            const formattedStartTime = (dayjsValues && dayjsValues[0]) ? dayjsValues[0].format("HH:mm") : "";
            const formattedFinishTime = (dayjsValues && dayjsValues[1]) ? dayjsValues[1].format("HH:mm") : "";
            console.log('Formatted Start Time:', formattedStartTime);
            console.log('Formatted Finish Time:', formattedFinishTime);
            console.log('New shift start and finish times:', formattedStartTime, formattedFinishTime);
            setShiftDetails(prev => ({ ...prev, startTime:formattedStartTime, finishTime: formattedFinishTime }));
            const calculatedHours = calculateHours(formattedStartTime, formattedFinishTime);
            console.log('Calculated Hours:', calculatedHours);
            setHoursWorked(calculatedHours)
          }}
          />
        </div>
      </FormItemWrapper>
    );
  }

  export default TimePickerComponent;