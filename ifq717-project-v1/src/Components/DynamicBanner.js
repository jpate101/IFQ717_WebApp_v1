// creating dynamic banner from the re-used header banner. can specify icon and text. 

/* Use like this: 

import RocketIcon from '../Icons/RocketIcon';
import DynamicBanner from '../DynamicBanner';

<DynamicBanner text="Tanda Launchpad" Icon={RocketIcon} />

*/ 

import React from 'react';

const DynamicBanner = ({ text, Icon }) => {
  return (
    <div className="launchpad-card mt-4 mr-3 ml-3 d-flex align-items-center justify-content-center p-3">
      <div style={{ position: 'relative', bottom: '0.5rem' }}>
        <Icon size="75" alt={`${text} icon`} />
      </div>
      <span>{text}</span>
    </div>
  );
};

export default DynamicBanner;