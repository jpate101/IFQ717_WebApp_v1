import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'https://my.tanda.co/api/v2';

// Helper function to get headers with the Authorization token
const getHeaders = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const TimesheetForUser = () => {
  let { userId } = useParams();
  const [timesheet, setTimesheet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('TimesheetForUser: userId', userId); // Log the userId on each render

  const getCurrentTimesheetForUser = async (userId) => {
    setIsLoading(true);
    console.log('getCurrentTimesheetForUser: Fetching for userId', userId); // Log the userId when fetching
    try {
      const headers = getHeaders();
      const url = `${API_BASE_URL}/timesheets/for/${userId}/current?show_costs=true&show_award_interpretation=true`;
      console.log('getCurrentTimesheetForUser: Fetch URL', url); // Log the URL being requested
      const response = await fetch(url, { method: 'GET', headers });

      console.log('getCurrentTimesheetForUser: Response status', response.status); // Log the response status

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('getCurrentTimesheetForUser: Fetched data', data); // Log the fetched data
      setTimesheet(data); // Set the timesheet state with the fetched data
    } catch (error) {
      console.error('getCurrentTimesheetForUser: Error fetching timesheet', error); // Log any errors
      setError(error);
    } finally {
      setIsLoading(false); // Ensure loading is set to false after fetch operation is complete
    }
  };

  useEffect(() => {
    if (userId) {
      getCurrentTimesheetForUser(userId);
    }
  }, [userId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error('TimesheetForUser: Error', error); // Log the error if one occurred
    return <p>Error fetching timesheet: {error.toString()}</p>;
  }

  console.log('TimesheetForUser: Timesheet state before rendering', timesheet); // Log the timesheet state before rendering

  if (!timesheet || !Array.isArray(timesheet.shifts)) {
    console.error('TimesheetForUser: Invalid timesheet data', timesheet); // Log if the timesheet data is invalid
    return <p>No timesheet data available or timesheet.shifts is not an array.</p>;
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <Table hover>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Shift Date</th>
          <th>Start</th>
          <th>Finish</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {timesheet.shifts.map((shift) => (
          <tr key={shift.id}>
            <td>{timesheet.user_id}</td>
            <td>{new Date(shift.date).toLocaleDateString()}</td>
            <td>{formatDate(shift.start)}</td>
            <td>{formatDate(shift.finish)}</td>
            <td>{shift.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TimesheetForUser;
