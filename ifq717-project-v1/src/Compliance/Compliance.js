import React, { useEffect, useState } from 'react';

import getUserToken from '../API/Utilities/getUserToken';
import useUserDetails from '../Hooks/useUserDetails';
import '../../src/style.css';
import '../Dashboard/dashboard.css';
import RocketIcon from '../Components/Icons/RocketIcon';
import AwardList from '../Components/AwardsList/AwardsList';

export default function Compliance() {
  const token = getUserToken();
  const user = useUserDetails(token);

  return (
    <main className="flex-grow-1">
      {user && (
        <div className="container mx-auto px-4">
          <div className="launchpad-card mt-4 mr-3 ml-3">
          <RocketIcon size="75" alt="tanda launchpad icon" />
            <span>Tanda Compliance</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 mx-1 md:mx-0 dashboard-cards-container items-start" style={{ gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, min-content)' }}>
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
              <h2 className="text-lg  mb-2 primary text-center">Manage Awards</h2>
                <h4 className="text-md  mb-2 secondary text-center"> {user.organisation}</h4>
                <AwardList />
              </div>
            </div>
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
              <h2 className="text-lg  mb-2 primary text-center">Employee Award Compliance</h2>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}