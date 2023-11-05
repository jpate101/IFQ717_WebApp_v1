import dayjs from 'dayjs';

export function formatShiftTime(time, timezone) {
  return dayjs(time).tz(timezone).format('HH:mm');
}

export function calculateHours(startTime, finishTime) {
    if (!startTime || !finishTime) {
      return "";
    }
    // Extract hours and minutes from the start and finish times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [finishHour, finishMinute] = finishTime.split(':').map(Number);
  
    // Calculate total start and finish minutes
    const totalStartMinutes = (startHour * 60) + startMinute;
    const totalFinishMinutes = (finishHour * 60) + finishMinute;
  
    // Calculate the difference in minutes
    let diffMinutes = totalFinishMinutes - totalStartMinutes;
  
    // Convert the difference to hours and minutes
    const hours = Math.floor(diffMinutes / 60);
    diffMinutes %= 60;
  
    // Return the formatted result
    if (diffMinutes === 0) {
      return `${hours}h `;
    } else {
      return `${hours}h ${diffMinutes}m`;  // Convert minutes to tenth of an hour
    }
  }
