import React, { useState, useEffect } from 'react';
import DynamicBanner from '../Components/DynamicBanner';
import RocketIcon from '../Components/Icons/RocketIcon';
import ClockInUserGrid from './ClockInUserGrid';
import ClockinOrgGrid from './ClockinOrgGrid'; 

export default function ClockIn() {
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'organisation');

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return (
    <main className="flex-grow-1">
      <div className="compliance-container mx-auto px-4">
        <DynamicBanner text="Manage Clockins" Icon={RocketIcon} />
        <div className="nav-tabs-container mt-4">
          <ul className="nav-tabs">
            <li className={`org-awards ${activeTab === 'organisation' ? 'active' : ''}`} onClick={() => setActiveTab('organisation')}>Organisation</li>
            <li className={`emp-awards ${activeTab === 'employee' ? 'active' : ''}`} onClick={() => setActiveTab('employee')}>Employee</li>
          </ul>
        </div>
        <div className="tab-pane">
          {activeTab === 'organisation' && (
            <div className="bg-white rounded-lg w-full md:w-auto mx-2 md:mx-0">
              <div className="p-1">
                { <ClockinOrgGrid /> }
              </div>
            </div>
          )}
          {activeTab === 'employee' && (
            <div className="bg-white rounded-lg w-full md:w-full mx-2 md:mx-1">
              <div className="p-1">
                <ClockInUserGrid />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}