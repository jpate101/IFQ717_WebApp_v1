import {useState, useEffect} from 'react';
import dayjs from 'dayjs';


const API_BASE_URL = 'https://my.tanda.co/api/v2';
const getHeaders = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Fetches roster data
export const getRosterForDate = async (date) => {
  try {
    const headers = getHeaders();
    const url = `${API_BASE_URL}/rosters/on/${date}?show_costs=true`;

    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Roster data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching roster data:', error);
    throw error;
  }
}


// Fetches a single schedule by id
export const getScheduleById = async (scheduleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}?show_costs=true&include_names=true&platform=false`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch schedule details. Status: ${response.status}`);
    }

    const scheduleData = await response.json();
    console.log('Schedule data received:', scheduleData);
    return scheduleData;
  } catch (error) {
    console.error('Error fetching schedule details:', error);
    throw error;
  }
};

// Fetches schedules by id
export const getSchedules = async () => {
  console.log('Current document.cookie:', document.cookie);
  const headers = getHeaders();
  console.log('Making API call to get schedules');

  try {
    const response = await fetch(`${API_BASE_URL}/schedules?ids`, { method: 'GET', headers });

    console.log(`Response from the server:`, response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const schedulesData = await response.json();
    console.log('Schedules data received:', schedulesData);
    return schedulesData;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
}

export const getSchedulesByUser = async (userIds, fromDate, toDate) => {
  const headers = getHeaders(); 
  const userIdsParam = userIds.join(',');
  const url = `${API_BASE_URL}/schedules?user_ids=${userIdsParam}&from=${fromDate}&to=${toDate}&show_costs=true&include_names=false`;

  try {
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return []; 
  }
};


// Fetches info about all visible users
export const getUsers = async (employeeId = null) => {
  try {
    const headers = getHeaders(); 

    let url = `${API_BASE_URL}/users?show_wages=true`;
    if (employeeId) {
      url = `${API_BASE_URL}/users/${employeeId}?show_wages=true`;
      console.log(`Fetching data for user with ID: ${employeeId}`);
    } else {
      console.log('Fetching data for all users');
    }
    console.log('Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('Response received', response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let usersData = await response.json();
    console.log('Users data received:', usersData);


    if (!Array.isArray(usersData)) {
      usersData = [usersData]; 
    }

    return usersData.map(user => ({
      id: user.id,
      name: user.name,
      hourly_rate: user.hourly_rate,
      department_ids: user.department_ids
    }));

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};



// Gets information about a user, including departments they belong to
export const getUserInfo = async (userId) => {
  try {
    const headers = getHeaders();

    const url = `${API_BASE_URL}/users/${userId}?show_wages=true`;

    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const userData = await response.json();
    console.log('User data received:', userData);

    return {
      id: userData.id,
      name: userData.name,
      departmentIds: userData.department_ids
    };

  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};


// Fetches departments
export const getAllDepartments = async () => {
  try {
    const headers = getHeaders();
    const url = `${API_BASE_URL}/departments`;

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const departmentsData = await response.json();
    console.log('Departments data received:', departmentsData);
    return departmentsData;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Fetches department by id
export const getDepartmentById = async (departmentId) => {
  if (!departmentId) {
    throw new Error('No department ID provided');
  }

  try {
    const headers = getHeaders(); 
    const url = `${API_BASE_URL}/departments/${departmentId}`;

    const response = await fetch(url, { method: 'GET', headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const departmentData = await response.json();
    console.log('Department data received:', departmentData);
    return departmentData;
  } catch (error) {
    console.error(`Error fetching department with id ${departmentId}:`, error);
    throw error;
  }
}

export function GetShifts(props) {
  const [shifts, setShifts] = useState({});

  const { fromDate, toDate } = props;

  useEffect(() => {

      if (!fromDate || !toDate) {
          return;
      }
      
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
      const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      };

      async function fetchShiftData() {
          try {
              console.log("Fetching shifts with URL:", `https://my.tanda.co/api/v2/shifts?from=${fromDate}&to=${toDate}&show_costs=true&show_notes=true`);
              console.log("Headers:", headers);

              const response = await fetch(`https://my.tanda.co/api/v2/shifts?from=${fromDate}&to=${toDate}&show_costs=true&show_notes=true`, {
                  method: 'GET',
                  headers: headers
              });

              console.log("Response Status:", response.status);
              console.log("Response Status Text:", response.statusText);

              if (!response.ok) {
                  throw new Error(`Network response was not ok: ${response.status}`);
              }

              const data = await response.json();

              console.log("Data:", data);

              const processedShifts = data.reduce((acc, shift) => {
                  const shiftDate = dayjs(shift.start * 1000).format('YYYY-MM-DD'); // Assuming shift.start is already in milliseconds. If it's in seconds, use shift.start * 1000
                  if (!acc[shiftDate]) {
                      acc[shiftDate] = [];
                  }
                  acc[shiftDate].push(shift);
                  return acc;
              }, {});

              setShifts(processedShifts);
          } catch (error) {
              console.error("There was an error fetching the shifts:", error);
          }
      }

      fetchShiftData();
  }, [fromDate, toDate]);

  return props.children(shifts);
}

// Creates a Roster for the given date
export const createSchedule = async (details) => {
  const headers = getHeaders(); 
  const url = `${API_BASE_URL}/schedules`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const scheduleData = await response.json();
    console.log('Schedule created:', scheduleData);

    return scheduleData;
    
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

// Deletes a schedule for the selected date

export const deleteSchedule = async (scheduleId) => {
  const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete schedule');
  }

  return response.json();
};

// Updates a schedule for the selected date

export const updateSchedule = async (schedule) => {
  const response = await fetch(`${API_BASE_URL}/schedules/${schedule.id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(schedule),
  });

  if (!response.ok) {
    throw new Error('Failed to update schedule');
  }

  return response.json();
};

// Updates the status of a timesheet
export const updateTimesheetStatus = async (timesheetId, newStatus) => {
  const url = `${API_BASE_URL}/timesheets/${timesheetId}`;
  const body = JSON.stringify({ status: newStatus });
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedTimesheet = await response.json();
    console.log('Updated Timesheet:', updatedTimesheet);
    return updatedTimesheet;
  } catch (error) {
    console.error('Error updating timesheet:', error);
    throw error; 
  }
};

//Updates the shift status
export const approveShift = async (shiftId) => {
  const url = `${API_BASE_URL}/shifts/${shiftId}`;
  const headers = getHeaders();
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status: 'APPROVED' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving shift:', error);
    throw error;
  }
};

// Get Locations
export const getLocations = async () => {
  const headers = getHeaders(); 
  try {
    const response = await fetch(`${API_BASE_URL}/locations?platform=false&show_business_hours=false`, {   
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const locations = await response.json();
    console.log('Locations data received:', locations);

    return locations;
  
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}

// Get current rosters

export const getCurrentRosters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rosters/current?show_costs=true`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching current rosters:', error);
    throw error;
  }
};

// Create shift reminder

export const createShiftReminder = async (minutesBeforeShiftStart) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shift_reminders`, { 
      method: 'POST', 
      headers: getHeaders(), 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Shift reminder created:', data);
    return data;
  } catch (error) {
    console.error('Error creating shift reminder:', error);
    throw error;
  }
};