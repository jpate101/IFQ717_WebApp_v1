// Modelling tasks

import { getLocations, getUsers, getSchedules, getAwards } from '../../API/Utilities';
import getTeams from '../../API/Utilities/getTeams';
import useUserDetails from '../../Hooks/useUserDetails';
import calculateNextSchedule  from '../../API/Utilities/calculateNextSchedule';
import getWebHooks from '../../API/Utilities/getWebHooks';

const completionCriteria = (data) => {
  return data.some((data) => data.id !== undefined);
};

const tasks = [
    {
      name: 'Add locations',
      label: 'Add locations',
      fetchFunction: getLocations,
      completionCriteria: completionCriteria,
    },
    {
      name: 'Add employees (5+)',
      label: 'Add employees (5+)',
      fetchFunction: getUsers,
      //completionCriteria: (data) => data.length > 99 // updated to 100 for testing and demonstration purposes
      completionCriteria: (data) => data.length > 4 // real value to finally commit
    },
    {
      name: 'Add teams',
      label: 'Add teams',
      fetchFunction: async () => {
        const teams = await getTeams({ page: 1, page_size: 1 });
        return teams;
      },
      completionCriteria: completionCriteria
    },
    /*{
      name: 'Create shifts on a roster',  
      fetchFunction: async () => {
          const users = await getUsers(); 
          const userIds = users.map(user => user.id); 
          const schedules = await calculateNextSchedule(userIds);
          console.log(schedules); 
          return schedules && Object.keys(schedules).length > 0; 
        },
      completionCriteria: (data) => data
    },*/
    {
      name: 'Create shifts on a roster',
      label: 'Create shifts',
      fetchFunction: async () => {
        const { shiftApproved } = await getWebHooks();
        return shiftApproved;
      },
      completionCriteria: (data) => data
    },
    {
      name: 'Approve a timesheet',
      label: 'Approve timesheet',
      fetchFunction: async () => {
        const { timesheetApproved } = await getWebHooks();
        return timesheetApproved;
      },
      completionCriteria: (data) => data
    },
    {
      name: 'At least 1 employee has clocked in',
      label: 'Await clockin',
      fetchFunction: async () => {
        const { isClockin } = await getWebHooks();
        return isClockin;
      },
      completionCriteria: (data) => data
    },
    {
      name: 'Enable Award',
      label: 'Enable Award',
      fetchFunction: getAwards,
      completionCriteria: (data) => data.some((award) => award.award_template_organisation_id !== null)
    }
    
  ];
  
  export default tasks;