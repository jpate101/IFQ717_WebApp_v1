import React, { useEffect, useState } from 'react';

import '../style.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
  
  // ASK TEAM HOW TO SHARE COMPLETION STATUS BETWEEN COMPONENTS
  const [completionStatus, setCompletionStatus] = useState({
    locations: true,
    teams: false,
    staff: false,
    schedules: false
  });

  // TODO: move this into a separate component and store the URL elsewhere.
  useEffect(() => {
    fetch('https://my.tanda.co/api/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error(error));
  }, [token]);


return (
  <main className="flex-grow-1">
    <header className="bg-background text-primary py-4">
      <h1 className="text-center text-2xl">Organisation Onboarding Overview</h1>
    </header>
    {user && (
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 mx-1 md:mx-0 dashboard-cards-container">
          <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">Organisation Onboarding Status</h2>
              <p className="text-gray-700">for organisation: {user.organisation}</p>
              <div className="flex flex-col mt-4 overflow-hidden align-items-center">
                <div className="bg-white p-2 flex-grow-0 flex-shrink-0 w-full">
                  <p className="text-gray-700">Tasks</p>
                </div>
                <div className="flex flex-row w-full">
                  <div className="bg-white p-4 flex-grow-1 flex-shrink-0 w-2/12">
                    <div className="flex flex-col dash-overall-grid-col-1">
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 flex-grow-1 flex-shrink-0 w-7/12">
                    <div className="flex flex-col dash-overall-grid-col-2">
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Add locations</p>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Add teams</p>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Create 3 staff members</p>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Create schedules</p>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Have not considered tracking: approve timesheet, payroll or clocking in (???)</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 flex-grow-1 flex-shrink-0 w-3/12">
                    <div className="flex flex-col dash-overall-grid-col-3">
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Dynamic</p>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Dynamic</p>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Dynamic</p>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Dynamic</p>
                      </div>
                      <div className="bg-white p-4 flex-grow-1 flex-shrink-0">
                        <p className="text-gray-700">Dynamic</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">Onboarding Progress Bar placeholder</h2>
              <p className="text-gray-700">for Organisation: {user.organisation}</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </main>
  );
}