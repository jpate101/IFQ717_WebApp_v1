// converting unlock svg to component. Component allows input of size. 

// usage: <UnlockIcon size="10" alt="unlock icon" />
import React from 'react';
import { ReactComponent as UnlockIcon } from '../../svg/unlock.svg';

export default function Unlock({ size = '24', alt = 'unlock icon' }) {
  return (
    <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      <UnlockIcon style={{ fill: 'var(--secondary-color)' }} width={size} height={size} aria-label={alt} />
    </div>
  );
}