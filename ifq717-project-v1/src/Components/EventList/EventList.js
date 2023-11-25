// EventList.js
import React, { useEffect, useState } from 'react';
import Event from './Event';
import { getUsers } from '../../API/Utilities.js';
import moment from 'moment';
import usePagination from '../../Hooks/usePagination';
import Pagination from '../Pagination.js';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const [currentItems, totalItems, setCurrentPage, currentPage] = usePagination(events, itemsPerPage);

  // TODO: refactor - see what can be split into a function or a reusable hook
  // logic for calculating next birthday and next anniversary
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        const events = usersData.flatMap(user => {
          const userEvents = [];
          if (user.date_of_birth) {
            const birthday = moment(user.date_of_birth);
            const nextBirthday = birthday.dayOfYear() <= moment().dayOfYear() ?
                                 moment(`${birthday.format('MM-DD')}-${moment().add(1, 'years').format('YYYY')}`, 'MM-DD-YYYY') : 
                                 moment(`${birthday.format('MM-DD')}-${moment().format('YYYY')}`, 'MM-DD-YYYY');
            const age = nextBirthday.year() - birthday.year();
            userEvents.push({ type: 'Birthday', date: nextBirthday, name: user.name, years: age });
          }
          if (user.employment_start_date) {
            //console.log('employment start date', user.employment_start_date)
            const employmentStartDate = moment(user.employment_start_date);
            let nextAnniversary;
            let yearsOfService;
          
            if (employmentStartDate.isAfter(moment())) {
              yearsOfService = 0;
              nextAnniversary = moment(`${employmentStartDate.format('MM-DD')}-${employmentStartDate.year()}`, 'MM-DD-YYYY');
            } else {
              nextAnniversary = employmentStartDate.dayOfYear() < moment().dayOfYear() ?
                                moment(`${employmentStartDate.format('MM-DD')}-${moment().add(1, 'years').format('YYYY')}`, 'MM-DD-YYYY') : 
                                moment(`${employmentStartDate.format('MM-DD')}-${moment().format('YYYY')}`, 'MM-DD-YYYY');
              yearsOfService = nextAnniversary.year() - employmentStartDate.year();
            }
          
            userEvents.push({ type: 'Milestone', date: nextAnniversary, name: user.name, years: yearsOfService });
          }
          return userEvents;
        });
        events.sort((a, b) => a.date.diff(b.date));
        setEvents(events);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col mt-4 overflow-hidden align-items-center">
      {isLoading && (
        <div className="text-center">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-500">Error: {error.message}</div>
      )}
      {!isLoading && !error && (
        <div className="w-full">
          {currentItems.map((event, index) => (
            <Event key={index} event={event} />
          ))}
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default EventList;