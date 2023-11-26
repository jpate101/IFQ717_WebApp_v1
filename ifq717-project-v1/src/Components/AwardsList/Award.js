// a component that models the Award entry for the list 

import React from 'react';
import '../EventList/event.css';
import AwardsButton from './AwardsButton';

const Award = ({ award }) => {
  const { name, identifier, award_template_organisation_id } = award;

  return (
    <div className="bg-white w-full" style={{ padding: '0 0.5rem 0.5rem 0.5rem', fontSize: '0.8rem' }}>
      <div className="flex items-start gap-2"> 
        <div style={{ flex: '3' }}>{name}</div>
        <div style={{ flex: '1' }}>{identifier}</div>
        <div style={{ flex: '2', textAlign: 'right' }}>
          {award_template_organisation_id === null ? (
            <AwardsButton award={award} />
          ) : (
            <span>Enabled</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Award;