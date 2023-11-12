// Function to dynamically display the task list status as a prompt to navigate to get the job done or to find information relevant after job done

import React from 'react';

export default function ProgressListProgression({ isLocations, isUsers, isTeam, isSchedule, isTimesheet, isClockin, task }) {
  if (task.taskname === 'Create schedules') {
    if (isSchedule) {
      return <span>Completed</span>;
    } else {
      return <button onClick={() => window.location.href = '/roster'}>{task.taskname}</button>;
    }
  } else if (task.taskname === 'Approve a timesheet') {
    if (isTimesheet) {
      return <span>Completed</span>;
    } else {
      return <button onClick={() => window.location.href = '/Timesheets/approveTimesheets'}>{task.taskname}</button>;
    }
  } else if (task.taskname === 'A team member has clocked in') {
    if (isClockin) {
      return <span>Completed</span>;
    } else {
      return <button onClick={() => window.location.href = '/dashboard'}>Coming soon</button>;
    }
  } else if (task.taskname === 'Add locations') {
    if (isLocations) {
      return <span>Completed</span>;
    } else {
      return <button onClick={() => window.location.href = '/root/EmployeeManagement'}>{task.taskname}</button>;
    }
  } else if (task.taskname === 'Add teams') {
    if (isTeam) {
      return <span>Completed</span>;
    } else {
      return <button onClick={() => window.location.href = '/root/EmployeeManagement'}>{task.taskname}</button>;
    }
  } else if (task.taskname === 'Add employees (5+)') {
    if (isUsers) {
      return <span>Completed</span>;
    } else {
      return <button onClick={() => window.location.href = '/EmployeeManagement'}>{task.taskname}</button>;
    }
  } else {
    return <button onClick={() => window.location.href = '/root/EmployeeManagement/'}>{task.taskname}</button>;
  }
}