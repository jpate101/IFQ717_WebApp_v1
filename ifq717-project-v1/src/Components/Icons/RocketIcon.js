// converting rocket svg to component. Component allows input of size. 

// usage: <Rocket size="100" alt="tanda launchpad icon" />
// RocketIcon.js
import React from 'react';
import { ReactComponent as RocketIcon } from '../../svg/rocket-launch.svg';

export default function Rocket({ size = '50', alt = 'launchpad icon' }) {
  return (
    <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      <RocketIcon width={size} height={size} aria-label={alt} />
    </div>
  );
}