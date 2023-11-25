import React, { useEffect, useState } from 'react';

import '../style.css';
import getUserToken from '../API/Utilities/getUserToken';
import useUserDetails from '../Hooks/useUserDetails';

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
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 mx-1 md:mx-0 dashboard-cards-container" style={{ gap: '1rem' }}>
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
                <h2 className="text-lg font-bold mb-2">Employee Dashboard</h2>
                <p className="text-gray-700">for organisation: {user.organisation}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
                <h2 className="text-lg font-bold mb-2">Progress Bar Placeholder</h2>
                <div className="bg-white rounded-lg shadow-lg p-4">
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}