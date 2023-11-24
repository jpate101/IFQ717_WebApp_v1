// Modelling an event, for inside the event list (for work anniversaries and birthdays)
import React, { useState } from 'react';
import EventIcon from './EventIcon';
import './event.css';
import '../../../src/style.css';
import useUserDetails from '../../Hooks/useUserDetails';
import sendEmailIcon from '../../svg/send-email.svg';

const Event = ({ event, token }) => {
  const { type, date, name, years } = event;
  const candles = years;
  const userDetails = useUserDetails(token);
  const loggedInUserName = userDetails ? userDetails.name : '';
  const userEmail = userDetails ? userDetails.email : '';
  const organisation = userDetails ? userDetails.organisation : '';
  const emailTo = userEmail ? userEmail : '';
  
  // Birthday Email - Refactor and put in its own file 
  const birthdayImageUrl = '';
  const emailSubject = `Happy Birthday ${name}!`;
  const emailBody = `Dear ${name},\n\nHope you have a great day for your birthday! \n\
  From ${loggedInUserName} & all of us at ${organisation} \n\n\
  <img src="${birthdayImageUrl}" alt="Happy Birthday ${name}" width="300">`;

  // Workiversary Email - Refactor and put in its own file
  const workiversaryImageUrl = '';
  const workEmailSubject = `Contratulations on ${years} years, ${name}!`;
  const workEmailBody = `Dear ${name},\n\nCongratulations on ${years} years with us at ${organisation}! \n\
  We love having you part of the team, and we appreciate all your work over ${years} years!
  <img src="${workiversaryImageUrl}" alt="Congratulations on ${years} years, ${name}!" width="300">
  From ${loggedInUserName} & all of us at ${organisation} \n\n\``

  // First day Email - Refactor and put in its own file
  const welcomeImageUrl = '';
  const welcomeEmailSubject = `Welcome to ${organisation}, ${name}!`;
  const welcomeEmailBody = `Dear ${name},\n\nWe are so pleased to welcome you to the crew! \n\
  Thanks for joining us, and we look forward to working with you! \n\
  From ${loggedInUserName} & all of us at ${organisation} \n\n\``

  // TODO: REFACTOR FILE
  return (
    <div className="bg-white p-2 w-full" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
      <div className="flex items-center gap-2">
        <div className="flex items-center" >
          <EventIcon type={type}  />
        </div>
        <div style={{ flex: '1' }}>{type}</div>
        <div style={{ flex: '1.25' }}>
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
        {type === 'Birthday' && (
          <a href={`mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
          style={{ backgroundColor: 'var(--background-color)', color: 'var(--primary-color)', border: `1px solid var(--primary-color)`, padding: '0.5rem 1rem', borderRadius: '0.25rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out' }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--background-color)';
            e.target.style.boxShadow = '0 1px 1px rgba(0, 0, 0, 0.05)';
          }}
        >
          <button>Email</button>
        </a>
        )}
        {type === 'Milestone' && years > 0 && (
          <a href={`mailto:${emailTo}?subject=${encodeURIComponent(workEmailSubject)}&body=${encodeURIComponent(workEmailBody)}`}>
            <button>Email</button>
          </a>
        )}
        {type === 'Milestone' && years === 0 && (
          <a href={`mailto:${emailTo}?subject=${encodeURIComponent(welcomeEmailSubject)}&body=${encodeURIComponent(welcomeEmailBody)}`}>
            <button>Email</button>
          </a>
        )}
        </div>
      </div>
    </div>
);
};

export default Event;