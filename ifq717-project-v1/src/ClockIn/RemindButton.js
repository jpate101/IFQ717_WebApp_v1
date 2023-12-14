import React from 'react';
import { sendAppReminder } from '../API/Utilities';
import LabelledButton from '../Components/Buttons/LabelledButton';

function RemindButton({ userId, isClockinOverdue }) {
  const handleClick = async () => {
    try {
      await sendAppReminder(userId);
      alert('Reminder sent!');
    } catch (error) {
      alert('Failed to send reminder.');
      console.error(error);
    }
  };

  const buttonClass = isClockinOverdue ? 'decline-button' : 'approve-button';

  return (
    <LabelledButton 
      buttonText="Remind"
      onClick={handleClick}
      className={buttonClass}
    />
  );
}

export default RemindButton;