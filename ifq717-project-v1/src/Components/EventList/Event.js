// Modelling an event, for inside the event list (for work anniversaries and birthdays)
import React from 'react';
import EventIcon from './EventIcon';
import './event.css';
import '../../../src/style.css';

const Event = ({ event }) => {
  const { type, date, name, years } = event;

  return (
    <div className="bg-white p-2 w-full" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
      <div className="grid grid-cols-5 items-center gap-4">
      <div className="flex items-center col-span-1 no-wrap min-width-0" style={{ marginRight: '5px' }}>
        <EventIcon type={type} className="w-6 h-6 no-shrink" />
        </div>
        <div className="ml-2">{type}</div>
        <div className="col-span-1">
          {date.format('DD-MM-YYYY')}
        </div>
        <div className="col-span-1">
          {name}
        </div>
        <div className="col-span-1">
            {years === 0 ? 'First day' : years === 1 ? '1 year' : `${years} years`}
        </div>
      </div>
    </div>
  );
};

export default Event;