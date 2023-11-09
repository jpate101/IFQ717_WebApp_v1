import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Button, FormCheck} from 'react-bootstrap';
import { Input } from 'antd';
import { getUsers } from '../API/Utilities';
import WeekPickerComponent from '../Components/Roster&Timesheets/WeekPicker';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb'; 

dayjs.locale('en-gb');

const API_BASE_URL = 'https://my.tanda.co/api/v2';

// Helper function to get headers with the Authorization token
const getHeaders = () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Helper function to format week range
const formatWeekRange = (date) => {
    if (!date || !dayjs(date).isValid()) {
        console.error('formatWeekRange - received invalid date:', date);
        return 'Invalid Date Range';
    }
};

const ExportTimesheets = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs().startOf('isoWeek'));
    const [timesheets, setTimesheets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedForExport, setSelectedForExport] = useState(new Set());

    const fetchTimesheets = async (startDate) => {
    setLoading(true);
    const endDate = startDate.endOf('isoWeek');
    let allTimesheets = [];
    try {
        const headers = getHeaders();
        for (let date = dayjs(startDate); date.isSameOrBefore(endDate); date = date.add(1, 'day')) {
        const dateForTimesheet = date.format('YYYY-MM-DD');
        const response = await fetch(`${API_BASE_URL}/timesheets/on/${dateForTimesheet}?show_costs=true&show_award_interpretation=true&approved_only=true`, {
            method: 'GET',
            headers: headers
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dailyTimesheets = await response.json();
        allTimesheets = allTimesheets.concat(dailyTimesheets);
        }
    
        setTimesheets(allTimesheets);
        console.log('Fetched timesheets:', allTimesheets);
    } catch (error) {
        console.error('Error fetching timesheets for week:', error);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    if (selectedDate.isValid()) {
        fetchTimesheets(selectedDate);
    }
    }, [selectedDate]); 

    const handleDateChange = (date) => {
    if (date) {
        const newSelectedDate = dayjs(date).startOf('isoWeek');
        setSelectedDate(newSelectedDate);
    }
    };

    useEffect(() => {
    const fetchUsers = async () => {
        try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        } catch (error) {
        console.error('Error fetching users:', error);
        }
    };

    fetchUsers();
    }, []);
    
    useEffect(() => {
    console.log('Effect to fetch timesheets for date:', selectedDate.toString());
    fetchTimesheets(selectedDate);
    getUsers().then(setUsers).catch(console.error);
    }, [selectedDate]);

    const getUserById = (userId) => {
        return users.find((user) => user.id === userId) || null;
    };

    const formatDate = (timestamp) => {
        // Convert Unix timestamp from seconds to milliseconds
        const date = new Date(timestamp * 1000);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            console.error(`Invalid timestamp: ${timestamp}`);
            return 'Invalid Date';
        } else {
            const formattedTime = dayjs(date).format('HH:mm');
            //console.log(`Formatted time for timestamp ${timestamp}:`, formattedTime); // Log the formatted time
            return formattedTime;
        }
    };

    const filteredTimesheets = timesheets.flatMap((timesheet) =>
        timesheet.shifts.map((shift) => {
            const user = getUserById(timesheet.user_id);
            const shiftDate = dayjs(shift.date).format('DD/MM/YYYY');
            return { ...shift, user_name: user ? user.name : 'N/A', shiftDate };
        })
    ).filter(shift => shift.user_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const toggleTimesheetSelection = (timesheetId) => {
        console.log(`Toggling selection for timesheet ID: ${timesheetId}`);
        setSelectedForExport((prevSelected) => {
            const newSelection = new Set(prevSelected);
            if (newSelection.has(timesheetId)) {
                newSelection.delete(timesheetId);
                console.log(`Removed timesheet ID ${timesheetId} from selection.`);
            } else {
                newSelection.add(timesheetId);
                console.log(`Added timesheet ID ${timesheetId} to selection.`);
            }
            console.log('Current selection:', Array.from(newSelection));
            return newSelection;
        });
    };
    
    const exportSelectedTimesheets = async () => {
        console.log('Exporting selected timesheets:', Array.from(selectedForExport));
        if (selectedForExport.size === 0) {
            console.log('No timesheets selected for export.');
            return;
        }
        // Construct a list of timesheet IDs to export
        const timesheetIds = Array.from(selectedForExport).join(',');
        // Call your API to export timesheets
        const exportUrl = `${API_BASE_URL}/timesheets/on/2023-11-07?export_format=csv&ids=${timesheetIds}`;
    
        try {
            const response = await fetch(exportUrl, {
                method: 'GET',
                headers: getHeaders()
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = 'timesheets_export.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            console.log(`Export successful: ${exportUrl}`);
        } catch (error) {
            console.error('Error exporting timesheets:', error);
        }
    };

    return (
        <div>
            <Row className="align-items-center mb-3">
                <Col className="d-flex align-items-center">
                <WeekPickerComponent  
                    selectedDate={selectedDate.toDate()}
                    onDateChange={handleDateChange}
                    formatWeekRange={formatWeekRange(selectedDate)}
                />
                </Col>
                <Col className="d-flex align-items-center">
                <Input.Search
                    placeholder="Search by employee name"
                    onSearch={(value) => setSearchTerm(value)}
                    size="large"
                    className="custom-search"
                    style={{ marginBottom: 9, color: '3498db'}}
                />
                </Col>
            </Row>
            <Button onClick={exportSelectedTimesheets} disabled={selectedForExport.size === 0}>
                Export Selected Timesheets
            </Button>
            <Table striped bordered hover className="timesheet-table">
                <thead>
                    <tr>
                        <th>Select</th> 
                        <th>User</th>
                        <th>Date</th>
                        <th>Start</th>
                        <th>Finish</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5">Loading...</td>
                        </tr>
                    ) : (
                        filteredTimesheets.length > 0 ? (
                            filteredTimesheets.map((shift) => (
                                <tr key={shift.id}>
                                    <td>
                                        <FormCheck
                                            checked={selectedForExport.has(shift.id)}
                                            onChange={() => toggleTimesheetSelection(shift.id)}
                                        />
                                    </td>
                                    <td>{shift.user_name}</td>
                                    <td>{shift.shiftDate}</td>
                                    <td>{formatDate(shift.start)}</td>
                                    <td>{formatDate(shift.finish)}</td>
                                    <td>{shift.status}</td>
                                </tr>
                                ))
                            ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No timesheets found.
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ExportTimesheets;