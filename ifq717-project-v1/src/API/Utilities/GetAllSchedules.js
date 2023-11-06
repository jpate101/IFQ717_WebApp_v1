// Get Schedules (just fetch any schedule for the organisation associated to the cookie)

// Fetches all schedules for the authenticated user (not filtered by ID or individual team member etc)

import SetHeaders from './SetHeaders';

// Fetches all schedules for the authenticated user
export const getAllSchedules = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/schedules`, {
      method: 'GET',
      headers: SetHeaders()
    });

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
};