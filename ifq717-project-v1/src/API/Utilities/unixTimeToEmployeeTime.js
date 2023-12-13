import moment from 'moment-timezone';

function unixTimeToEmployeeTime(loginTime, timeZone) {
  if (loginTime === null || loginTime === undefined || timeZone === undefined) {
    return null;
  }

  const time = moment.unix(loginTime).tz(timeZone);

  if (time === undefined) {
    return null;
  }

  const formattedTime = time.format('DD-MM-YY HH:mm');

  return formattedTime;
}

export default unixTimeToEmployeeTime;