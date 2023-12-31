import React, { useState, useEffect } from 'react';
import { Dropdown, Card, Button } from 'react-bootstrap';
import { DatePicker, Upload, message, Button as AntButton} from 'antd';
//import { UploadOutlined } from '@ant-design/icons';
import LeaveSidebar from '../Components/Leave/LeaveSidebar';
import UnavailabilitySidebar from '../Components/Leave/UnavailabilitySidebar';
import { 
  getUsers, 
  getLeaveList, 
  getUnavailabilityList, 
  updateLeaveRequest, 
  updateUnavailabilityRequest,
  getDefaultLeaveHours,
  createTemporaryFile,
  deleteUnavailability,
} from '../API/Utilities';
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
  const [leaveHours, setLeaveHours] = useState({});
  const [fileUploads, setFileUploads] = useState({});
  const [refreshUnavailTrigger, setRefreshUnavailTrigger] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs(),
    dayjs().add(6, 'months')
  ]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(userData => {
      console.log('Fetched user data:', userData);
      setUsers(userData);
      const userIds = userData.map(user => user.id);
      const from = dateRange[0].format('YYYY-MM-DD');
      const to = dateRange[1].format('YYYY-MM-DD');
      return getLeaveList(userIds, from, to);
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
      getUsers().then(userData => {
        const userIds = userData.map(user => user.id)
        const from = dateRange[0].format('YYYY-MM-DD');
        const to = dateRange[1].format('YYYY-MM-DD');
    
        getUnavailabilityList({ user_ids: userIds, from, to })
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
    }, [activeTab, dateRange, refreshUnavailTrigger]);
  
    useEffect(() => {
      pendingRequests.forEach(async (request) => {
        try {
          const hours = await getDefaultLeaveHours(request.user_id, request.start, request.finish, request.leave_type);
          setLeaveHours(prevHours => ({ ...prevHours, [request.id]: hours }));
        } catch (error) {
          console.error(`Error fetching leave hours for request ${request.id}:`, error);
        }
      });
    }, [pendingRequests]);

  const findUserNameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  const handleLeaveClick = () => {
    setShowLeaveSidebar(true);
  };
  
  const handleUnavailabilityClick = () => {
    setShowUnavailabilitySidebar(true);
  };

  const handleApproveLeave = async (requestId) => {
    try {
      await updateLeaveRequest(requestId, { status: 'approved' });
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      setApprovedRequests(prev => [...prev, { ...pendingRequests.find(req => req.id === requestId), status: 'approved' }]);
    } catch (error) {
      console.error(`Error approving leave request:`, error);
    }
  };

  const handleDeclineLeave = async (requestId) => {
    try {
      await updateLeaveRequest(requestId, { status: 'rejected' });
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      setRejectedRequests(prev => [...prev, { ...pendingRequests.find(req => req.id === requestId), status: 'rejected' }]);
    } catch (error) {
      console.error(`Error declining leave request:`, error);
    }
  };

  const handleApproveUnavailability = async (request) => {
    try {
      const updateData = {
        status: 'approved',
        title: request.title,
        start: request.start,
        finish: request.finish

      };
      await updateUnavailabilityRequest(request.id, updateData);
      setPendingUnavailabilityRequests(prev => prev.filter(req => req.id !== request.id));
      setApprovedUnavailabilityRequests(prev => [...prev, { ...request, status: 'approved' }]);
    } catch (error) {
      console.error(`Error approving unavailability request:`, error);
    }
  };
  
  const handleDeleteUnavailability = async (unavailabilityId) => {
    try {
      await deleteUnavailability(unavailabilityId);
      setPendingUnavailabilityRequests(prev => prev.filter(req => req.id !== unavailabilityId));
      setApprovedUnavailabilityRequests(prev => prev.filter(req => req.id !== unavailabilityId));
      setRejectedUnavailabilityRequests(prev => prev.filter(req => req.id !== unavailabilityId));
    } catch (error) {
      console.error('Error deleting unavailability:', error);
    }
  };

  const handleNewUnavailabilityRequest = (newRequest) => {
    setPendingUnavailabilityRequests(prevRequests => [...prevRequests, newRequest]);
    setRefreshUnavailTrigger(prev => !prev);
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
      const userName = findUserNameById(request.user_id);
      const formattedStartDate = dayjs(request.start).format('DD MMM YYYY');
      const formattedFinishDate = dayjs(request.finish).format('DD MMM YYYY');
      const period = formattedStartDate === formattedFinishDate
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedFinishDate}`;

      const uploadProps = {
        customRequest({ file, onSuccess, onError }) {
          createTemporaryFile(file, "image/jpeg,image/jpg,image/png,application/pdf")
            .then(response => {
              const file_id = response;
              setFileUploads(prev => ({ ...prev, [request.id]: file_id }));
              onSuccess(response, file);
              message.success({ content: `${file.name} file uploaded successfully`, key: 'upload' });
            })
            .catch(error => {
              onError(error);
              message.error({ content: `${file.name} file upload failed.`, key: 'upload' });
            });
        },
        showUploadList: false,
      };
       
      return (
        <Card key={request.id} className="mb-3">
          <Card.Header className="mt-1">
            <div>{userName}</div>
            {/*<div>Requested on: {formattedUpdatedAt}</div>*/}
          </Card.Header>
          <Card.Body className="less-column-padding smaller-font">
            <div className="row">
              <div className="col-6 font-weight-bold">Period:</div>
              <div className="col-6">{period}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Times:</div>
              <div className="col-6">{}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Type:</div>
              <div className="col-6">{request.leave_type}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Paid Hours:</div>
              <div className="col-6">{leaveHours[request.id] || 'Loading...'}</div>
              <div className="col-6">{}</div>
            </div>
            <div className="row">
              <div className="col-6 font-weight-bold">Reason:</div>
              <div className="col-6">{request.reason}</div>
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between  smaller-font">
            {activeTab === 'pending' && (
              <>
                <Button 
                  className="approve-button"
                  variant="success" 
                  onClick={() => handleApproveLeave(request.id)}
                >
                  Approve
                </Button>
                <Button 
                  className="decline-button"
                  variant="danger"
                  onClick={() => handleDeclineLeave(request.id)}
                >
                  Decline
                </Button>
              </>
            )}
            {activeTab === 'approved' && (
              <div className="d-flex justify-content-end w-100">
                <Button 
                  className="decline-button"
                  variant="danger"
                  onClick={() => handleDeclineLeave(request.id)}
                >
                  Decline
                </Button>
              </div>
            )}
            {activeTab === 'rejected' && (
              <span>
                Your leave request has been {request.status}.
              </span>
            )}
          </Card.Footer>
        </Card>
      );
    };

    const numberToDayString = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };
    
    const convertNumbersToDayStrings = (numbers) => {
      return numbers.split(',').map(num => numberToDayString[num]).join(', ');
    };

    const formatUnavailabilityRequestCard = (request) => {
      const userName = findUserNameById(request.user_id);

      console.log('request updated_at:', request.updated_at)
      const startDate = dayjs.unix(request.start).format('DD MMM YYYY');
      const finishDate = dayjs.unix(request.finish).format('DD MMM YYYY');
      const period = `${startDate} - ${finishDate}`;
      const times = request.all_day ? 'All day' : `${dayjs.unix(request.start).format('HH:mm')} - ${dayjs.unix(request.finish).format('HH:mm')}`;
      const frequency = request.repeating ? (request.repeating_info?.interval === 'week' ? 'Weekly' : 'Daily') : 'Once-off';
      const repeatsOn = request.repeating_info?.interval === 'week' 
        ? convertNumbersToDayStrings(request.repeating_info.days_of_week) 
        : 'N/A';

      return (
        <Card key={request.id} className="mb-3 -mr-2">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div>{userName}</div>
                {/*<div>Requested on: {formattedUpdatedAt}</div>*/}
              </div>
              {(activeTab === 'pending' || activeTab === 'approved') && (
                <Button 
                  className="decline-button px-3"
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteUnavailability(request.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </Card.Header>
          <Card.Body className="less-column-padding smaller-font">
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
              <div className="col-6 font-weight-bold">Reason:</div>
              <div className="col-6">{request.title}</div>
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between smaller-font">
            {activeTab === 'pending' && (
              <>
                <Button 
                  className="approve-button"
                  variant="success" 
                  onClick={() => handleApproveUnavailability(request)}
                >
                  Approve
                </Button>
                <Button 
                  className="decline-button"
                  variant="danger"
                  //onClick={() => handleDeclineUnavailability(request)}
                >
                  Decline
                </Button>
              </>
            )}
            {activeTab === 'approved' && (
              <div className="d-flex justify-content-end w-100">
                <Button 
                  className="decline-button"
                  variant="danger"
                  onClick={() => handleDeclineLeave(request.id)}
                >
                  Decline
                </Button>
              </div>
            )}
            {activeTab === 'rejected' && (
              <span>
                Your unavailability request has been {request.status}.
              </span>
            )}
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
                <h3 style={{ textAlign: 'center' }}>Leave Requests</h3>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map(formatLeaveRequestCard)
                ) : (
                  <p>No pending leave requests.</p>
                )}
              </div>
              <div className="pending-unavailability-requests w-50 pr-2">
                <h3 style={{ textAlign: 'center' }}>Unavailability Requests</h3>
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
                <h3 style={{ textAlign: 'center' }}>Leave Requests</h3>
                {approvedRequests.length > 0 ? (
                  approvedRequests.map(formatLeaveRequestCard)
                ) : (
                  <p>No approved leave requests.</p>
                )}
              </div>
              <div className="pending-unavailability-requests w-50 pr-2">
                <h3 style={{ textAlign: 'center' }}>Unavailability Requests</h3>
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
                <h3  style={{ textAlign: 'center' }}>Leave Requests</h3>
                {rejectedRequests.length > 0 ? (
                  rejectedRequests.map(formatLeaveRequestCard)
                ) : (
                  <p>No rejected leave requests.</p>
                )}
              </div>
              <div className="pending-unavailability-requests w-50 pr-2">
                <h3 style={{ textAlign: 'center' }}>Unavailability Requests</h3>
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
        rejectedUnavailabilityRequests={rejectedUnavailabilityRequests}
      />
      <LeaveSidebar
        show={showLeaveSidebar}
        handleClose={() => setShowLeaveSidebar(false)}
      />
      <UnavailabilitySidebar
        show={showUnavailabilitySidebar}
        handleClose={() => setShowUnavailabilitySidebar(false)}
        onNewRequestCreated={handleNewUnavailabilityRequest}
      />
    </div>
  );
};

export default LeaveRequestTabs;