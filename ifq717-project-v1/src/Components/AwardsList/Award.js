// a component that models the Award entry for the list 

import React, { useState } from 'react';
import '../EventList/event.css';
import AwardsButton from './AwardsButton';

const Award = ({ award, setAwardButtonError, isFirst }) => {
    const { name, identifier, award_template_organisation_id } = award;
    const [isAwardEnabled, setIsAwardEnabled] = useState(false);
  
    return (
        <div className={`bg-white w-full ${isFirst ? 'mt-2' : ''}`} style={{ padding: '0 0.5rem 0.5rem 0.5rem', fontSize: '0.8rem' }}>
        <div className="flex items-start gap-2"> 
          <div style={{ flex: '1' }}>{identifier}</div>
          <div style={{ flex: '3' }}>{name}</div>
          <div className='mb-2' style={{ flex: '2', textAlign: 'right' }}>
            {award_template_organisation_id === null && !isAwardEnabled ? (
              <AwardsButton award={award} setIsAwardEnabled={setIsAwardEnabled} setAwardButtonError={setAwardButtonError} />
            ) : (
              <span className="mr-2.5">Enabled</span>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Award;