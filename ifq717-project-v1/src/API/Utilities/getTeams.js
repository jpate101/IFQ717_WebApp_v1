// providing capability to specify page_size optionally, for purpose of getting only small amt of data for the task list 

import SetHeaders from './SetHeaders';

const GetTeams = async ({ page = 1, page_size = 1 }) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/departments?page=${page}&page_size=${page_size}`, {
      headers: SetHeaders()
    });

    if (response.ok) {
      const teams = await response.json();
      return teams;
    } else {
      throw new Error('Failed to fetch teams data');
    }
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

export default GetTeams;
