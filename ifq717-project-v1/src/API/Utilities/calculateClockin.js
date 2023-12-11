import { getClockIns } from '../Utilities.js';
import unixTimeToEmployeeTime from './unixTimeToEmployeeTime.js';

export const calculateClockin = async (userId, timezone) => {
    // Date params for query clockin range of 30 days in past
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
    const formattedToDate = toDate.toISOString().slice(0, 10);
    const formattedFromDate = fromDate.toISOString().slice(0, 10);
  
    // Fetch the clockin info per user.
    const clockinInfo = await getClockIns(userId, formattedFromDate, formattedToDate);
  
    // Filter for 'start' type clock-ins
    const startClockins = clockinInfo.filter(clockin => clockin.type === 'start');
  
    // Find the earliest and latest clockin unix timestamp and convert to readable time.
    const earliestClockin = startClockins.reduce((earliest, current) => current.time < earliest.time ? current : earliest, startClockins[0]);
    const latestClockin = startClockins.reduce((latest, current) => current.time > latest.time ? current : latest, startClockins[0]);
    const firstClockin = earliestClockin ? unixTimeToEmployeeTime(earliestClockin.time, timezone) : null;
    const lastClockin = latestClockin ? unixTimeToEmployeeTime(latestClockin.time, timezone) : null;
  
    return { firstClockin, lastClockin };
};

export default calculateClockin;