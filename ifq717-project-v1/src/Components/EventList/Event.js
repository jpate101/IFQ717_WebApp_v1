// Modelling an event, for inside the event list (for work anniversaries and birthdays)
import React, { useState } from 'react';
import EventIcon from './EventIcon';
import './event.css';
import '../../../src/style.css';
import useUserDetails from '../../Hooks/useUserDetails';
import { getEventEmailTemplate } from './eventEmailTemplates';
import { ReactComponent as SendEmailIcon } from '../../svg/send-email.svg';
import IconButton from '../Buttons/IconButton';


const Event = ({ event, token }) => {
  const { type, date, name, years } = event;
  const candles = years;
  const userDetails = useUserDetails(token);
  const loggedInUserName = userDetails ? userDetails.name : '';
  const userEmail = userDetails ? userDetails.email : '';
  const organisation = userDetails ? userDetails.organisation : '';
  const emailTo = userEmail ? userEmail : '';
  
  const { emailSubject, emailBody } = getEventEmailTemplate(type, name, years, loggedInUserName, organisation);

  // TODO: REFACTOR FILE
  return (
    <div className="bg-white w-full" style={{ padding: '0 0.5rem 0.5rem 0.5rem', fontSize: '0.8rem' }}>
      <div className="flex items-center gap-2">
        <div className="flex items-center" >
          <EventIcon type={type}  />
        </div>
        <div style={{ flex: '1' }}>{type}</div>
        <div style={{ flex: '1.5' }}>
          {date.format('DD-MM-YYYY')}
        </div>
        <div style={{ flex: '2' }}>
          {name}
        </div>
        <div style={{ flex: '1.25' }}>
        {type === 'Birthday' 
          ? (candles === 1 ? '1 candle' : `${years} candles`) 
          : (years === 0 ? 'First day' : years === 1 ? '1 year' : `${years} years`)
        }
        </div>
        <div style={{ flex: '1' }}>
        {(type === 'Birthday') && (
        <IconButton icon={SendEmailIcon} href={`mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}></IconButton>
        )}
        {type === 'Milestone' && years > 0 && (
          <IconButton icon={SendEmailIcon} href={`mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}></IconButton>
        )}
        {type === 'Milestone' && years === 0 && (
          <IconButton icon={SendEmailIcon} href={`mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}></IconButton>
        )}
        </div>
      </div>
    </div>
);
};

export default Event;