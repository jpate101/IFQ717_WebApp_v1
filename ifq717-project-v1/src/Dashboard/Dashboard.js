import React, { useEffect, useState } from 'react';

import getUserToken from '../API/Utilities/getUserToken';
import useUserDetails from '../Hooks/useUserDetails';
import TaskList from '../Components/TaskList/TaskList';
import '../../src/style.css';

export default function Dashboard() {
  const token = getUserToken();
  const user = useUserDetails(token);

  return (
    <main className="flex-grow-1">
      <header className="bg-background text-primary py-4">
        <h1 className="text-center text-2xl">Launchpad</h1>
      </header>
      {user && (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 mx-1 md:mx-0 dashboard-cards-container" style={{ gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
              <h2 className="text-lg  mb-2 primary text-center">Onboarding Progress</h2>
                <h4 className="text-md  mb-2 secondary text-center"> {user.organisation}</h4>
                <TaskList />
              </div>
            </div>
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
                <h2 className="text-lg  mb-2 primary text-center">Sprint 2 widget placeholder</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}