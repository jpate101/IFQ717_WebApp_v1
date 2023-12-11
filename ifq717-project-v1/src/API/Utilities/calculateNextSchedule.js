import moment from 'moment';
import setHeaders from './setHeaders';

const API_BASE_URL = 'https://my.tanda.co/api/v2';

const calculateNextSchedule = async (userIds) => {
  const now = moment();
  const from = now.add(1, 'days').format('YYYY-MM-DD');
  const to = now.add(7, 'days').format('YYYY-MM-DD');
  let schedules;

  try {
    const headers = setHeaders();
    const url = `${API_BASE_URL}/schedules?user_ids=${userIds.join(',')}&from=${from}&to=${to}`;

    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    schedules = await response.json();
  } catch (error) {
    console.error('Error getting schedules:', error);
    return null;
  }

  const userSchedules = {};

  schedules.forEach(schedule => {
    if (!userSchedules[schedule.user_id] || moment(schedule.start).isBefore(userSchedules[schedule.user_id].start)) {
      userSchedules[schedule.user_id] = schedule;
    }
  });

  return userSchedules;
};

export default calculateNextSchedule;