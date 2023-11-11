import FormItemWrapper from './FormItemWrapper';
import { ReactComponent as CalendarIcon } from '../../svg/calendar.svg'
import dayjs from 'dayjs';

function DateFormItem({ shiftDate }) {
    
  const iconStyle = {
    marginTop: '5px',
    transform: 'translateY(-3px) translateX(-2px)',
    width: '22px',
    height: '22px'
  }

  return (
    <FormItemWrapper>
      <CalendarIcon
        className="bi bi-calendar w-5 h-5 ml-0.5 mr-4 tanda-icon"
        style={iconStyle}
      >
      </CalendarIcon>
      <div
        style={{
          fontSize: '16px',
          marginLeft: -8
        }}
      >{shiftDate ? dayjs(shiftDate).format('DD MMM YYYY') : ''}</div>
    </FormItemWrapper>
  );
}

  export default DateFormItem;