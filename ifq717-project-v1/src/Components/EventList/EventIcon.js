// EventIcon.js
import React from 'react';
import { ReactComponent as BirthdayIcon } from '../../svg/cake.svg';
import { ReactComponent as AnniversaryIcon } from '../../svg/calendar-days.svg';

export default function EventIcon({ type }) {
  const Icon = type === 'Birthday' ? BirthdayIcon : AnniversaryIcon;

  return <Icon className="events-icons" />;
}