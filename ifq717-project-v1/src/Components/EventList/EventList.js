// EventList.js
import React, { useEffect, useState } from 'react';
import Event from './Event';
import { getUsers } from '../../API/Utilities.js';
import moment from 'moment';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
            const start = moment(user.employment_start_date);
            console.log(user.name, start);
            const nextAnniversary = start.dayOfYear() < moment().dayOfYear() ?
                                   moment(`${start.format('MM-DD')}-${moment().add(1, 'years').format('YYYY')}`, 'MM-DD-YYYY') : 
                                   moment(`${start.format('MM-DD')}-${moment().format('YYYY')}`, 'MM-DD-YYYY');
            console.log('calculated as: ', nextAnniversary);
            const yearsOfService = nextAnniversary.year() - start.year();
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
          {events.map((event, index) => (
            <Event key={index} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;