import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import LeaveSidebar from '../Components/Leave/LeaveSidebar';
import UnavailabilitySidebar from '../Components/Leave/UnavailabilitySidebar';
import '../App.css';


const NavTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className='nav-tabs-container'>
        <ul className="nav-tabs">
            <li className={`pending ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending</li>
            <li className={`approved ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>Approved</li>
            <li className={`rejected ${activeTab === 'rejected' ? 'active' : ''}`} onClick={() => setActiveTab('rejected')}>Rejected</li>
        </ul>
    </div>
  );
};

const TabContent = ({ activeTab }) => {
  switch (activeTab) {
    case 'pending':
      return <div className="tab-pane">Pending requests content</div>;
    case 'approved':
      return <div className="tab-pane">Approved requests content</div>;
    case 'rejected':
      return <div className="tab-pane">Rejected requests content</div>;
    default:
      return <div className="tab-pane">Select a tab</div>;
  }
};

const LeaveRequestTabs = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [showLeaveSidebar, setShowLeaveSidebar] = useState(false);
    const [showUnavailabilitySidebar, setShowUnavailabilitySidebar] = useState(false);

    const handleLeaveClick = () => {
        setShowLeaveSidebar(true);
    };
    const handleUnavailabilityClick = () => {
        setShowUnavailabilitySidebar(true);
    };

    return (
      <div className="leave-requests">
        <Dropdown>
          <Dropdown.Toggle className="custom-dropdown">
            Request Time Off
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLeaveClick}>Leave</Dropdown.Item>
            <Dropdown.Item onClick={handleUnavailabilityClick}>Unavailability</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabContent activeTab={activeTab} />

        <LeaveSidebar show={showLeaveSidebar} handleClose={() => setShowLeaveSidebar(false)} />
        <UnavailabilitySidebar show={showUnavailabilitySidebar} handleClose={() => setShowUnavailabilitySidebar(false)} />
      </div>
    );
  };

export default LeaveRequestTabs;
