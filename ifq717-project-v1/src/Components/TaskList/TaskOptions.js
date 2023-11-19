// Modelling tasks

import { getLocations, getUsers, getSchedules } from '../../API/Utilities';
import getTeams from '../../API/Utilities/getTeams';
import useUserDetails from '../../Hooks/useUserDetails';

const completionCriteria = (data) => {
  return data.some((data) => data.id !== undefined);
};

const tasks = [
    {
      name: 'Add locations',
      fetchFunction: getLocations,
      completionCriteria: completionCriteria,
    },
    {
      name: 'Add employees (100+)',
      fetchFunction: getUsers,
      completionCriteria: (data) => data.length > 99 // updated to 100 for testing and demonstration purposes
      //completionCriteria: (data) => data.length > 4 // real value to finally commit
    },
    {
      name: 'Add teams',
      fetchFunction: async () => {
        const teams = await getTeams({ page: 1, page_size: 1 });
        return teams;
      },
      completionCriteria: completionCriteria
    },
    {
      name: 'Create shifts on a roster',
      /*fetchFunction: async () => {
        const user = await useUserDetails();
        const userId = user.map((user) => user.id);
        const schedules = await getSchedules(userId);
        return schedules;*/
        // refactor sprint 2 to use state
      //},
      completionCriteria: completionCriteria,
      isComplete: true
    },
    {
      name: 'Approve a timesheet',
      //fetchFunction: getTimesheet,
      //completionCriteria: completionCriteria
      // update sprint 2 to use state
      isComplete: true
    },
    {
      name: 'At least 1 employee has clocked in',
      isComplete: false
      // update sprint 2 after built (use state)
    }
    
  ];
  
  export default tasks;