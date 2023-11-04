import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import '../App.css';
import '../index.css';
import '../Tailwind.css';
import WeekPickerComponent from '../Components/WeekPicker';
import dayjs from 'dayjs';
import GetUsers from '../Components/GetUsers';  // Adjust the path accordingly
import { calculateHours, formatShiftTime } from '../Components/CalculateHours';
import GetShifts from '../Components/GetShifts';
import GetDepartment from '../Components/GetDepartment';

function ApproveTimesheets() {
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        fetch('https://my.tanda.co/api/v2/timesheets/current?show_costs=true&show_award_interpretation=true', {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error("Error fetching data:", error));
    }, [selectedDate]);

    return (
        <div>
            <div className="flex items-center">
                <WeekPickerComponent 
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            </div>
            <GetShifts 
                fromDate={dayjs(selectedDate).startOf('week').format('YYYY-MM-DD')} 
                toDate={dayjs(selectedDate).endOf('week').format('YYYY-MM-DD')}
            >
                {(shifts) => (
                    <GetUsers>
                        {(users) => (
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Date</th>
                                        <th>Rostered Hours</th>
                                        <th>Worked Hours</th>
                                        <th>Cost</th>
                                        <th>Department</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {Object.values(shifts).flat().map(shift => (
                                        <tr key={shift.id}>
                                            <td>{users[shift.user_id]?.name || shift.user_id}</td>
                                            <td>{`${dayjs.unix(shift.start).format('DD MMM')} - ${dayjs.unix(shift.finish).format('DD MMM YYYY')}`}</td>
                                            <td>{calculateHours(formatShiftTime(shift.start), formatShiftTime(shift.finish))}</td>
                                            <td>{/* Worked hours - Calculate as needed */}</td>
                                            <td>{shift.cost}</td>
                                            <td>
                                                <GetDepartment departmentId={shift.department_id}>
                                                    {(department) => (
                                                        // Display the department name if available, otherwise show a placeholder or the ID
                                                        department ? department.name : 'Loading...'
                                                    )}
                                                </GetDepartment>
                                            </td>
                                            <td>{Array.isArray(shift.notes) && shift.notes.length > 0 ? shift.notes[0].body : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </GetUsers>
                )}
            </GetShifts>
        </div>
    );
}

export default ApproveTimesheets;
