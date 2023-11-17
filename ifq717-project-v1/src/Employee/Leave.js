import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { DatePicker } from 'antd';
import LeaveSidebar from '../Components/Leave/LeaveSidebar';
import UnavailabilitySidebar from '../Components/Leave/UnavailabilitySidebar';
import { getCurrentUser, getLeaveList } from '../API/Utilities';
import dayjs from 'dayjs';
import '../App.css';

const { RangePicker } = DatePicker;

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

const TabContent = ({ activeTab, pendingRequests }) => {
  switch (activeTab) {
    case 'pending':
        return (
            <div className="tab-pane">
              <h3>Pending Requests</h3>
              {pendingRequests.length > 0 ? (
                pendingRequests.map(request => (
                  <div key={request.id}>
                    {request.reason} - {request.start} to {request.finish}
                  </div>
                ))
              ) : (
                <p>No pending requests.</p>
              )}
            </div>
          );
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
    const [pendingRequests, setPendingRequests] = useState([]);
    const [dateRange, setDateRange] = useState([
        dayjs(),
        dayjs().add(6, 'months')
      ]);

    useEffect(() => {
        if (activeTab === 'pending') {
          getCurrentUser().then(userData => {
            console.log('Fetched user data:', userData);
            const from = dateRange[0].format('YYYY-MM-DD');
            const to = dateRange[1].format('YYYY-MM-DD');
            return getLeaveList([userData.id], from, to);
          })
          .then(data => {
            const pending = data.filter(request => request.status === 'pending');
            setPendingRequests(pending);
          })
          .catch(error => console.error('Error fetching pending leave requests:', error));
        }
      }, [activeTab, dateRange]);
      

    const handleLeaveClick = () => {
        setShowLeaveSidebar(true);
    };
    const handleUnavailabilityClick = () => {
        setShowUnavailabilitySidebar(true);
    };

    return (
        <div className="leave-requests">
            <div className="dropdown-datepicker-container justify-between">
                <Dropdown>
                    <Dropdown.Toggle className="custom-dropdown">
                        Request Time Off
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleLeaveClick}>Leave</Dropdown.Item>
                        <Dropdown.Item onClick={handleUnavailabilityClick}>Unavailability</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <RangePicker
                    defaultValue={dateRange}
                    onChange={(dates) => setDateRange(dates)}
                />
            </div>
            <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabContent 
                activeTab={activeTab}
                pendingRequests={pendingRequests}
            />
            <LeaveSidebar show={showLeaveSidebar} handleClose={() => setShowLeaveSidebar(false)} />
            <UnavailabilitySidebar show={showUnavailabilitySidebar} handleClose={() => setShowUnavailabilitySidebar(false)} />
        </div>
    );
};

export default LeaveRequestTabs;
