// placeholder for fetching the completion status from the other APIs

// call team if one team say complete 
// call locations if one location set as complete 
// call schedules if one schedule set as complete
// call users if count is 5 set as complete 

// UPDATE THIS SO THAT IF ONE FAILS, THE OTHERS WORK 
// UPDATE THIS SO THAT I CAN CALL GET COMPLETIONSTATUS for all or for individual 


import { useState, useEffect } from 'react';
import { getAllSchedules } from './GetAllSchedules';

function GetCompletionStatus() {
  const [isScheduleComplete, setIsScheduleComplete] = useState(false);

  useEffect(() => {
    console.log('Fetching schedules to build the schedule state for progress indicators');
    getAllSchedules()
      .then(data => {
        console.log('Schedules data received:', data);
        if (data.length > 0) {
          console.log('Setting schedule completion state to true');
          setIsScheduleComplete(true);
        } else {
          console.log('Setting schedule completion state to false');
          setIsScheduleComplete(false);
        }
      })
      .catch(error => console.error('Error fetching schedules:', error));
  }, []);

  return isScheduleComplete;
}

export default GetCompletionStatus;