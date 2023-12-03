import React, { useState, useEffect } from 'react';
import { Offcanvas, Dropdown, DropdownButton, Form, Button, FormCheck } from 'react-bootstrap';
import { DatePicker, Space, Input, ConfigProvider } from 'antd';
import { getCurrentUser, getLeaveTypesForUser, createLeaveRequest } from '../../API/Utilities';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const BASE_URL = 'https://my.tanda.co';

const LeaveSidebar = ({ show, handleClose }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [isAllDay, setIsAllDay] = useState(true);
    const [leaveRequest, setLeaveRequest] = useState({
        user_id: '',
        start: '',
        start_time: '',
        finish: '',
        finish_time: '',
        reason: '',
        leave_type: '',
        allDay: isAllDay,
    });

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const userData = await getCurrentUser();
            console.log('Fetched user data:', userData);
            console.log('User photo URL:', userData.photo);
            setCurrentUser(userData);
            setLeaveRequest((lr) => ({ ...lr, user_id: userData.id }));
            const userLeaveTypes = await getLeaveTypesForUser(userData.id);
            console.log('Fetched leave types:', userLeaveTypes);
            setLeaveTypes(userLeaveTypes);
        } catch (error) {
            console.error('Error fetching user data or leave types:', error);
        }
    };
    fetchUserData();
    }, []);

    const handleDateTimeChange = (_, formattedDates) => {
        console.log('DateTime Change - Selected Time: ', formattedDates);
        if (formattedDates.length === 2 && formattedDates[0] && formattedDates[1]) {
            const formatString = isAllDay ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';
            const startDate = dayjs(formattedDates[0], formatString);
            const endDate = dayjs(formattedDates[1], formatString);
    
            if (!startDate.isValid() || !endDate.isValid()) {
                console.error("Invalid date format");
                return;
            }
    
            console.log('Parsed Start Date:', startDate.format());
            console.log('Parsed End Date:', endDate.format()); 
            const updatedRequest = {
                ...leaveRequest,
                start: startDate.format('YYYY-MM-DD'),
                start_time: isAllDay ? '2000-01-01 00:00:00' : startDate.format('YYYY-MM-DD HH:mm:ss'),
                finish: endDate.format('YYYY-MM-DD'),
                finish_time: isAllDay ? '2000-01-01 23:59:59' : endDate.format('YYYY-MM-DD HH:mm:ss'),
            };
            console.log('Updated leave request after date change:', updatedRequest);
            setLeaveRequest(updatedRequest);
        } else {
            console.error("Invalid date selection");
        }
    };
    

    const handleCreateLeaveRequest = async () => {
        console.log('Creating Leave Request with:', leaveRequest);
        const requestData = {
            ...leaveRequest,
            all_day: isAllDay,
            user_id: currentUser.id,
            status: 'pending',
        };
        console.log('Sending request data:', requestData);
        try {
            const response = await createLeaveRequest(requestData);
            console.log('Leave Request Created:', response);
            handleClose();
            alert('Leave Request Successfully Submitted');
        } catch (error) {
            console.error('Error creating leave request:', error);
            console.error('Error details:', error.response || error);
        }
    };
    

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Request Leave</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <div>
                <img 
                    src={currentUser.photo ? (currentUser.photo.startsWith('http') ? currentUser.photo : `${BASE_URL}${currentUser.photo}`) : 'default_image_path'}
                    alt={currentUser.name || 'Default Name'} 
                    style={{ width: '100px', height: '100px' }}
                />
                <h3 className="mt-3">{currentUser.name}</h3>
            </div>
            <Form>
                <Form.Group>
                    <DropdownButton  
                        title={leaveRequest.leave_type || "Select Leave Type"} 
                        onSelect={(eventKey) => setLeaveRequest({...leaveRequest, leave_type: eventKey})}
                        className="leave-custom-dropdown"
                    >
                        {leaveTypes.map((type, index) => (
                            <Dropdown.Item 
                                key={index} 
                                eventKey={type}
                            >
                                {type}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Form.Group>
                <Form.Group>
                    <Form.Label>All-day</Form.Label>
                    <FormCheck
                        type="switch"
                        checked={isAllDay}
                        onChange={() => setIsAllDay(!isAllDay)}
                        className="mb-3"
                    />
                </Form.Group>
                <Space direction ="vertical" size={12}>
                    <ConfigProvider>
                        <RangePicker
                            showTime={!isAllDay}
                            format={isAllDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                            onChange={handleDateTimeChange}
                            minuteStep={15}
                            className="mb-3"
                        />
                    </ConfigProvider>
                </Space>
                <Form.Group>
                    <Form.Label>Reason</Form.Label>
                    <Input.TextArea
                        rows={4}
                        onChange={(e) => setLeaveRequest({...leaveRequest, reason: e.target.value})} 
                        
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={handleCreateLeaveRequest}
                    className="create-button"
                >
                    Create
                </Button>
            </Form>
        </Offcanvas.Body>
        </Offcanvas>
    );
};

export default LeaveSidebar;
