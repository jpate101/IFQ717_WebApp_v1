// The organisation onboarding overview progression list grid code

import { useState, useEffect } from 'react';
import ProgressListIcon from './ProgressListIcon';
import ProgressListTask from './ProgressListTask';
import ProgressListProgression from './ProgressListProgression';
import { getLocations, getUsers } from '../../API/Utilities';

function getCompletionStatus(setIsLocations, setIsUsers) {
  console.log('Fetching locations to check completion status');
  getLocations()
    .then(data => {
      if (data.length > 0) {
        setIsLocations(true);
        console.log('isLocations = true');
      } else {
        setIsLocations(false);
        console.log('isLocations = false');
      }
    })
    .catch(error => console.error('Error fetching locations:', error));

  console.log('Fetching users to check completion status');
  getUsers()
    .then(data => {
      if (data.length > 4) {
        setIsUsers(true);
        console.log('isUsers = true');
      } else {
        setIsUsers(false);
        console.log('isUsers = false');
      }
    })
    .catch(error => console.error('Error fetching users:', error));
}

export default function ProgressList({ tasks }) {
  const [isLocations, setIsLocations] = useState(false);
  const [isUsers, setIsUsers] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const [isTimesheets, setIsTimesheets] = useState(false);
  const [isClockin, setIsClockin] = useState(false);

  useEffect(() => {
    getCompletionStatus(setIsLocations, setIsUsers);
  }, []);

  return (
    <div className="flex flex-col mt-4 overflow-hidden align-items-center">
      {tasks.map((task, index) => (
        <div key={index} className="bg-white p-2 flex-grow-0 flex-shrink-0 w-full" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
          <div className="flex flex-row items-center">
            <div className="mr-2">
              <ProgressListIcon />
            </div>
            <div className="flex-grow-1 flex-shrink-0">
              <ProgressListTask task={task.taskname} />
            </div>
            <div className="ml-2">
              <ProgressListProgression isLocations={isLocations} isUsers={isUsers} isTeam={isTeam} isSchedule={isSchedule} isTimesheet={isTimesheets} isClockin={isClockin} task={task} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}