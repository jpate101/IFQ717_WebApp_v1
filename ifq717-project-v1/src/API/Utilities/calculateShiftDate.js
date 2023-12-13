// a function that will take in a user id, and a definition of if we want the last or next shift, and then calculate what that last or next shift date is

import moment from 'moment';
import { getShiftsByUserAndDate } from '../Utilities.js';

const calculateShiftDate = async (when, employeeId) => {
  const now = moment();
  let from, to, shifts, shift;

  try {
    if (when === 'next') {
      from = now.format('YYYY-MM-DD');
      to = now.add(2, 'weeks').format('YYYY-MM-DD');
      shifts = await getShiftsByUserAndDate(employeeId, from, to);
      shift = shifts.find(shift => moment(shift.start).isAfter(now));
    } else if (when === 'prev') {
      to = now.format('YYYY-MM-DD');
      from = now.subtract(2, 'weeks').format('YYYY-MM-DD');
      shifts = await getShiftsByUserAndDate(employeeId, from, to);
      shift = shifts.reverse().find(shift => moment(shift.finish).isBefore(now));
    }
  } catch (error) {
    console.error('Error getting shifts:', error);
    return null;
  }

  if (!shift) {
    return null;
  }

  return {
    shift_type: when,
    date: shift.date,
    start: shift.start,
    end: shift.finish
  };
};

export default calculateShiftDate;