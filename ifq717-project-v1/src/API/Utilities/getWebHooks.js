function getWebHooks() {
  return fetch(`http://localhost:5000/data`)
    .then(response => response.json())
    .then(data => {
      let isClockin = false;
      let scheduleCreated = false;
      let shiftApproved = false;
      let timesheetApproved = false;

      data.forEach(row => {
        if (row.includes('clockin.updated')) {
          isClockin = true;
        }
        if (row.includes('schedule.created')) {
          scheduleCreated = true;
        }
        if (row.includes('shift.approved')) {
          shiftApproved = true;
        }
        if (row.includes('timesheet.approved')) {
          timesheetApproved = true;
        }
      });

      return { isClockin, scheduleCreated, shiftApproved, timesheetApproved };
    })
    .catch(error => {
      console.error('Error:', error);
      return null;
    });
}

export default getWebHooks;