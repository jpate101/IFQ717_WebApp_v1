// converting minimal rocket svg to component. Component allows input of size. 

// usage: <MinimalRocket size="10" alt="tanda launchpad icon" />
import React from 'react';
import { ReactComponent as MinimalRocketIcon } from '../../svg/minimal-rocket.svg';

export default function MinimalRocket({ size = '24', alt = 'rocket icon' }) {
  return (
    <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      <MinimalRocketIcon width={size} height={size} aria-label={alt} />
    </div>
  );
}