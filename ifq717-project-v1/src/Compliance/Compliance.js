import React, { useState, useEffect } from 'react';
import getUserToken from '../API/Utilities/getUserToken';
import useUserDetails from '../Hooks/useUserDetails';
import '../../src/style.css';
import '../Dashboard/dashboard.css';
import RocketIcon from '../Components/Icons/RocketIcon';
import AwardList from '../Components/AwardsList/AwardsList';
import EmployeesAwardsList from '../Components/EmployeesAwardList/EmployeeAwardList';
import '../../src/App.css';

export default function Compliance() {
  const token = getUserToken();
  const user = useUserDetails(token);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'organisation');

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  return (
    <main className="flex-grow-1">
      {user && (
        <div className="compliance-container mx-auto px-4">
          <div className="launchpad-card mt-4 mr-3 ml-3">
            <RocketIcon size="75" alt="tanda launchpad icon" />
            <span>Tanda Compliance</span>
          </div>
          <div className="nav-tabs-container mt-4">
          <ul className="nav-tabs">
            <li className={`org-awards ${activeTab === 'organisation' ? 'active' : ''}`} onClick={() => setActiveTab('organisation')}>Organisation Awards</li>
            <li className={`emp-awards ${activeTab === 'employee' ? 'active' : ''}`} onClick={() => setActiveTab('employee')}>Employee Awards</li>
          </ul>
          </div>
          <div className="tab-pane">
            {activeTab === 'organisation' && (
              <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
                <div className="p-1">
                  <h2 className="text-lg  mb-2 primary text-center">Manage Organisation Awards</h2>
                  <h4 className="text-md  mb-2 secondary text-center"> {user.organisation}</h4>
                  <AwardList />
                </div>
              </div>
            )}
            {activeTab === 'employee' && (
              <div className="bg-white rounded-lg w-full md:w-full mx-2 md:mx-1">
                <div className="p-1">
                  <h2 className="text-lg  mb-2 primary text-center">Manage Employee Awards</h2>
                  <EmployeesAwardsList />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}