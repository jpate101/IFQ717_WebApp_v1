// manage the org. onboarding task list's button state and options

import React from 'react';
import LabelledButton from '../Buttons/LabelledButton';
import '../../style.css';
import '../../index.css';

const taskURLs = {
  'Add locations': '/root/EmployeeManagement',
  'Add employees (5+)': '/root/EmployeeManagement', // set back to 5 now; // 100 for test/demo of incomplete task (temporary)
  'Add teams': '/root/EmployeeManagement',
  'Create shifts on a roster': '/roster',
  'Approve a timesheet': '/timesheets/approveTimesheets',
  'Enable Award': '/Compliance'
};

export default function TaskButton({ taskName, isComplete }) {
  if (taskName === 'At least 1 employee has clocked in') {
    return <span>Coming Soon</span>;
  }
  if (isComplete) {
    return <span>Complete</span>;
  }

  return <LabelledButton buttonText={taskName} to={taskURLs[taskName]} />;
}