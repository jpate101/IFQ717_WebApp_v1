import React, { useState, useEffect } from 'react';
import { Dropdown, Card } from 'react-bootstrap';
import { DatePicker } from 'antd';
import LeaveSidebar from '../Components/Leave/LeaveSidebar';
import UnavailabilitySidebar from '../Components/Leave/UnavailabilitySidebar';
import { getCurrentUser, getLeaveList } from '../API/Utilities';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/en_GB'
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

const LeaveRequestTabs = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [showLeaveSidebar, setShowLeaveSidebar] = useState(false);
  const [showUnavailabilitySidebar, setShowUnavailabilitySidebar] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [dateRange, setDateRange] = useState([
      dayjs(),
      dayjs().add(6, 'months')
    ]);
    const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    getCurrentUser().then(userData => {
      setCurrentUserName(userData.name);
    })
  }, [activeTab, dateRange]);

  useEffect(() => {
    getCurrentUser().then(userData => {
      console.log('Fetched user data:', userData);
      const from = dateRange[0].format('YYYY-MM-DD');
      const to = dateRange[1].format('YYYY-MM-DD');
      return getLeaveList([userData.id], from, to);
    })
    .then(data => {
      if (activeTab === 'pending') {
        const pending = data.filter(request => request.status === 'pending');
        setPendingRequests(pending);
      } else if (activeTab === 'approved') {
        const approved = data.filter(request => request.status === 'approved');
        setApprovedRequests(approved);
      } else if (activeTab === 'rejected') {
        const rejected = data.filter(request => request.status === 'rejected');
        setRejectedRequests(rejected);
      }
    })
    .catch(error => console.error(`Error fetching ${activeTab} leave requests:`, error));
    }, [activeTab, dateRange]);
      
  const handleLeaveClick = () => {
      setShowLeaveSidebar(true);
  };
  const handleUnavailabilityClick = () => {
      setShowUnavailabilitySidebar(true);
  };

  const TabContent = ({ activeTab, pendingRequests, approvedRequests, rejectedRequests }) => {
  
    const formatRequestCard = (request) => {
      const formattedUpdatedAt = dayjs.unix(request.updated_at).format('YYYY-MM-DD HH:mm:ss');
      const formattedStartDate = dayjs(request.start).format('DD MMM YYYY');
      const formattedFinishDate = dayjs(request.finish).format('DD MMM YYYY');
      const period = formattedStartDate === formattedFinishDate
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedFinishDate}`;
      return (
        <Card key={request.id} className="mb-3">
          <Card.Header>
            {currentUserName} - Created at: {formattedUpdatedAt}
          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-6 font-weight-bold">Period:</div>
              <div className="col-6">{period}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Type:</div>
              <div className="col-6">{request.leave_type}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Reason:</div>
              <div className="col-6">{request.reason}</div>
            </div>
          </Card.Body>
          <Card.Footer>
            Your request hasn't been approved or declined yet. You will receive an email when it is actioned.
          </Card.Footer>
        </Card>
      );
    };
    switch (activeTab) {
      case 'pending':
          return (
              <div className="tab-pane">
            {pendingRequests.length > 0 ? (
              pendingRequests.map(formatRequestCard)
            ) : (
              <p>No pending requests.</p>
            )}
          </div>
        );
      case 'approved':
          return (
              <div className="tab-pane">
                <h3>Approved Requests</h3>
                {approvedRequests.length > 0 ? (
                  approvedRequests.map(request => (
                    <div key={request.id}>
                      {request.reason} - {request.start} to {request.finish}
                    </div>
                  ))
                ) : (
                  <p>No approved requests.</p>
                )}
              </div>
            );
      case 'rejected':
          return (
              <div className="tab-pane">
                <h3>Rejected Requests</h3>
                {rejectedRequests.length > 0 ? (
                  rejectedRequests.map(request => (
                    <div key={request.id}>
                      {request.reason} - {request.start} to {request.finish}
                    </div>
                  ))
                ) : (
                  <p>No rejected requests.</p>
                )}
              </div>
            );
      default:
        return <div className="tab-pane">Select a tab</div>;
    }
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
            locale={locale}
          />
      </div>
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContent 
        activeTab={activeTab}
        pendingRequests={pendingRequests}
        approvedRequests={approvedRequests}
        rejectedRequests={rejectedRequests}
      />
      <LeaveSidebar show={showLeaveSidebar} handleClose={() => setShowLeaveSidebar(false)} />
      <UnavailabilitySidebar show={showUnavailabilitySidebar} handleClose={() => setShowUnavailabilitySidebar(false)} />
    </div>
  );
};

export default LeaveRequestTabs;