// creating dynamic banner from the re-used header banner. can specify icon and text. 

/* Use like this: 

import RocketIcon from '../Icons/RocketIcon';
import DynamicBanner from '../DynamicBanner';

<DynamicBanner text="Tanda Launchpad" Icon={RocketIcon} />

*/ 

import React from 'react';

const DynamicBanner = ({ text, Icon }) => {
  return (
    <div className="launchpad-card mt-4 mr-3 ml-3">
      <Icon size="75" alt={`${text} icon`} />
      <span>{text}</span>
    </div>
  );
};

export default DynamicBanner;