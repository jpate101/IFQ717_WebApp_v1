// utility to Update a single employee record with the award template id 

import setHeaders from './setHeaders';

export const addAwardToEmployee = async (employeeId, awardId) => {
  const headers = setHeaders();
  const url = `${process.env.REACT_APP_API_BASE_URL}/users/${employeeId}`;
  const body = {
    award_template_id: awardId
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`Error response status: ${response.status}`);
    }
    const responseBody = await response.json();
    return { status: response.status, body: responseBody };
  } catch (error) {
    console.error('Error adding award to employee:', error);
    throw error; // keep!! for allowing the caller to pick up the error
  }
}

export default addAwardToEmployee;