import React, { useEffect, useState } from 'react';

import '../style.css';
import GetToken from '../API/Utilities/GetToken';
import GetUserDetails from '../API/Utilities/GetUserDetails';
import ProgressList from '../Components/ProgressList/ProgressList';
import StackedProgressBar from '../Components/ProgressBar/StackedProgressBar';

const tasks = [
  { taskname: 'Add locations', completion: 'Dynamic' },
  { taskname: 'Add teams', completion: 'Dynamic' },
  { taskname: 'Add employees (5+)', completion: 'Dynamic' },
  { taskname: 'Create schedules', completion: 'Dynamic' },
  { taskname: 'Approve a timesheet', completion: 'Dynamic' },
  { taskname: 'A team member has clocked in', completion: 'Dynamic' }
];

export default function Dashboard() {
  const token = GetToken();
  const user = GetUserDetails(token);

  return (
    <main className="flex-grow-1">
      <header className="bg-background text-primary py-4">
        <h1 className="text-center text-2xl">Launchpad</h1>
      </header>
      {user && (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 mx-1 md:mx-0 dashboard-cards-container" style={{ gap: '1rem' }}>
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
                <h2 className="text-lg font-bold mb-2">Organisation Onboarding Status (work in progress)</h2>
                <p className="text-gray-700">for organisation: {user.organisation}</p>
                <ProgressList tasks={tasks} />
              </div>
            </div>
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
                <h2 className="text-lg font-bold mb-2">Progress Bar Placeholder</h2>
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <StackedProgressBar />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}