import React, { useState, useEffect } from 'react';
import { Dropdown, Card } from 'react-bootstrap';
import { DatePicker } from 'antd';
import LeaveSidebar from '../Components/Leave/LeaveSidebar';
import UnavailabilitySidebar from '../Components/Leave/UnavailabilitySidebar';
import { getCurrentUser, getLeaveList, getUnavailabilityList } from '../API/Utilities';
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
  const [pendingUnavailabilityRequests, setPendingUnavailabilityRequests] = useState([]);
  const [approvedUnavailabilityRequests, setApprovedUnavailabilityRequests] = useState([]);
  const [rejectedUnavailabilityRequests, setRejectedUnavailabilityRequests] = useState([]);
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

    useEffect(() => {
      getCurrentUser().then(userData => {
        const from = dateRange[0].format('YYYY-MM-DD');
        const to = dateRange[1].format('YYYY-MM-DD');
    
        getUnavailabilityList({ user_ids: [userData.id], from, to })
          .then(data => {
            if (activeTab === 'pending') {
              const pending = data.filter(request => request.status === 'pending');
              setPendingUnavailabilityRequests(pending);

            } else if (activeTab === 'approved') {
              const approved = data.filter(request => request.status === 'approved');
              setApprovedUnavailabilityRequests(prev => [...prev, ...approved]);

            } else if (activeTab === 'rejected') {
              const rejected = data.filter(request => request.status === 'rejected');
              setRejectedUnavailabilityRequests(prev => [...prev, ...rejected]);
            }
          })
          .catch(error => console.error(`Error fetching ${activeTab} unavailability requests:`, error));
      })
      .catch(error => console.error(`Error fetching user data:`, error));
    }, [activeTab, dateRange]);
    
  
  const handleLeaveClick = () => {
      setShowLeaveSidebar(true);
  };
  const handleUnavailabilityClick = () => {
      setShowUnavailabilitySidebar(true);
  };

  const TabContent = ({
    activeTab, 
    pendingRequests, 
    approvedRequests, 
    rejectedRequests, 
    pendingUnavailabilityRequests, 
    approvedUnavailabilityRequests, 
    rejectedUnavailabilityRequests 
  }) => {
  
    const formatLeaveRequestCard = (request) => {
      const formattedUpdatedAt = dayjs.unix(request.updated_at).format('YYYY-MM-DD HH:mm:ss');
      const formattedStartDate = dayjs(request.start).format('DD MMM YYYY');
      const formattedFinishDate = dayjs(request.finish).format('DD MMM YYYY');
      const period = formattedStartDate === formattedFinishDate
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedFinishDate}`;

      return (
        <Card key={request.id} className="mb-3">
          <Card.Header>
            {currentUserName} - Requested on: {formattedUpdatedAt}
          </Card.Header>
          <Card.Body className="less-column-padding">
            <div className="row">
              <div className="col-6 font-weight-bold">Period:</div>
              <div className="col-6">{period}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Type:</div>
              <div className="col-6">{request.leave_type}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Paid Hours:</div>
              <div className="col-6">{}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Current Balance:</div>
              <div className="col-6">{}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Document</div>
              <div className="col-6">{}</div>
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

    const formatUnavailabilityRequestCard = (request) => {
      const formattedUpdatedAt = dayjs.unix(request.updated_at).format('YYYY-MM-DD HH:mm:ss');
      console.log('request updated_at:', request.updated_at)
      const startDate = dayjs.unix(request.start).format('DD MMM YYYY');
      const finishDate = dayjs.unix(request.finish).format('DD MMM YYYY');
      const period = `${startDate} - ${finishDate}`;
      const times = request.all_day ? 'All day' : `${dayjs.unix(request.start).format('HH:mm')} - ${dayjs.unix(request.finish).format('HH:mm')}`;
      const frequency = request.repeating ? (request.repeating_info?.interval === 'week' ? 'Weekly' : 'Daily') : 'Once-off';
      const repeatsOn = request.repeating_info?.interval === 'week' ? `Every ${dayjs.unix(request.start).format('dddd')}` : 'N/A';
    
      return (
        <Card key={request.id} className="mb-3">
          <Card.Header>
          {currentUserName} - Requested on: {formattedUpdatedAt}
          </Card.Header>
          <Card.Body className="">
            <div className="row">
              <div className="col-6 font-weight-bold">Period:</div>
              <div className="col-6">{period}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Times:</div>
              <div className="col-6">{times}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Frequency:</div>
              <div className="col-6">{frequency}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Repeats on:</div>
              <div className="col-6">{repeatsOn}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Type:</div>
              <div className="col-6">Unavailability</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Reason:</div>
              <div className="col-6">{request.title}</div>
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
            <div className="leave-card-container">
              <div className="pending-leave-requests w-50 pr-2" >
                <h3>Leave Requests</h3>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map(formatLeaveRequestCard)
                ) : (
                  <p>No pending leave requests.</p>
                )}
              </div>
              <div className="pending-unavailability-requests w-50 pr-2">
                <h3>Unavailability Requests</h3>
                {pendingUnavailabilityRequests.length > 0 ? (
                  pendingUnavailabilityRequests.map(formatUnavailabilityRequestCard)
                ) : (
                  <p>No pending unavailability requests.</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'approved':
        return (
          <div className="tab-pane">
            <div className="leave-card-container">
              <div className="pending-leave-requests w-50 pr-2" >
                <h3>Leave Requests</h3>
                {approvedRequests.length > 0 ? (
                  approvedRequests.map(formatLeaveRequestCard)
                ) : (
                  <p>No approved leave requests.</p>
                )}
              </div>
              <div className="pending-unavailability-requests w-50 pr-2">
                <h3>Unavailability Requests</h3>
                {approvedUnavailabilityRequests.length > 0 ? (
                  approvedUnavailabilityRequests.map(formatUnavailabilityRequestCard)
                ) : (
                  <p>No approved unavailability requests.</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="tab-pane">
            <div className="leave-card-container">
              <div className="pending-leave-requests w-50 pr-2" >
                <h3>Leave Requests</h3>
                {rejectedRequests.length > 0 ? (
                  rejectedRequests.map(formatLeaveRequestCard)
                ) : (
                  <p>No rejected leave requests.</p>
                )}
              </div>
              <div className="pending-unavailability-requests w-50 pr-2">
                <h3>Unavailability Requests</h3>
                {rejectedUnavailabilityRequests.length > 0 ? (
                  rejectedUnavailabilityRequests.map(formatUnavailabilityRequestCard)
                ) : (
                  <p>No rejected unavailability requests.</p>
                )}
              </div>
            </div>
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
        pendingUnavailabilityRequests={pendingUnavailabilityRequests}
        approvedUnavailabilityRequests={approvedUnavailabilityRequests}
      />
      <LeaveSidebar show={showLeaveSidebar} handleClose={() => setShowLeaveSidebar(false)} />
      <UnavailabilitySidebar show={showUnavailabilitySidebar} handleClose={() => setShowUnavailabilitySidebar(false)} />
    </div>
  );
};

export default LeaveRequestTabs;