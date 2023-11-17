import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, FormCheck } from 'react-bootstrap';
import { DatePicker, Space, Input } from 'antd';
import { getCurrentUser, getLeaveTypesForUser, createLeaveRequest } from '../../API/Utilities';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

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
            setCurrentUser(userData);
            setLeaveRequest((lr) => ({ ...lr, user_id: userData.id })); // Set user_id here
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
            const startDate = dayjs(formattedDates[0], 'YYYY-MM-DD HH:mm');
            const endDate = dayjs(formattedDates[1], 'YYYY-MM-DD HH:mm');
            const updatedRequest = {
                ...leaveRequest,
                start: startDate.format('YYYY-MM-DD'),
                start_time: '2000-01-01 ' + startDate.format('HH:mm:ss'),
                finish: endDate.format('YYYY-MM-DD'),
                finish_time: '2000-01-01 ' + endDate.format('HH:mm:ss'),
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
            allDay: isAllDay,
            user_id: currentUser.id,
            status: 'pending',
        };
        console.log('Sending request data:', requestData);
        try {
            const response = await createLeaveRequest(requestData);
            console.log('Leave Request Created:', response);
            handleClose();
            alert('Leave Request Successfully Submited');
        } catch (error) {
            console.error('Error creating leave request:', error);
            console.error('Error details:', error.response || error); // Log detailed error information
        }
    };
    

    return (
        <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Request Leave</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <div>
            <img src={currentUser.photo} alt={currentUser.name} style={{ width: '100px', height: '100px' }} />
            <h3>{currentUser.name}</h3>
            </div>
            <Form>
            <Form.Group>
                <Form.Label>Leave Type</Form.Label>
                <Form.Control as="select" onChange={(e) => setLeaveRequest({...leaveRequest, leave_type: e.target.value})}>
                {leaveTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>All-day</Form.Label>
                <FormCheck
                    type="checkbox"
                    role="switch"
                    checked={isAllDay}
                    onChange={() => setIsAllDay(!isAllDay)}
                />
            </Form.Group>
            <Space direction ="vertical" size={12}>
                <RangePicker
                    showTime={!isAllDay}
                    format={isAllDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                    onChange={handleDateTimeChange}
                    minuteStep={15}
                />
            </Space>
            <Form.Group>
                <Form.Label>Reason</Form.Label>
                <Input.TextArea rows={4} onChange={(e) => setLeaveRequest({...leaveRequest, reason: e.target.value})} />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateLeaveRequest}>Create</Button>
            </Form>
        </Offcanvas.Body>
        </Offcanvas>
    );
};

export default LeaveSidebar;
