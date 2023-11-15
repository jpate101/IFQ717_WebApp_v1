// manage the onboarding task list's button state and options

import React from 'react';
import '../../style.css';
import '../../index.css';

const taskURLs = {
  'Add locations': '/root/EmployeeManagement',
  'Add employees (100+)': '/root/EmployeeManagement', // set to 100 for test/demo of incomplete task (temporary)
  'Add teams': '/root/EmployeeManagement',
  'Create shifts on a roster': '/roster',
  'Approve a timesheet': '/timesheets/approveTimesheets'
};

export default function TaskButton({ taskName, isComplete }) {
  if (taskName === 'At least 1 employee has clocked in') {
    return <span>Coming Soon</span>;
  }
  if (isComplete) {
    return <span>Complete</span>;
  }

  const taskButtonText = `${taskName}`;
  const href = taskURLs[taskName];

  // TODO move styling to shared CSS 
  return (
    <a href={href} style={{ backgroundColor: 'var(--background-color)', color: 'var(--primary-color)', border: `1px solid var(--primary-color)`, padding: '0.5rem 1rem', borderRadius: '0.25rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out' }} 
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'white';
        e.target.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'var(--background-color)';
        e.target.style.boxShadow = '0 1px 1px rgba(0, 0, 0, 0.05)';
      }}
    >
      {taskButtonText}</a>
  );
}