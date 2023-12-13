// Re-usable Task styled button component. Can provide own text & nav. 
// Can use like: <LabelledButton buttonText={taskName} href={href} />
// Now a MEGA button! Supports Href, on click, Disabling, Error states, different labels according to state
// Look into separating out styling :-)  
// LabelledButton.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../../style.css';
import '../../index.css';
import '../../App.css';

export default function LabelledButton({ buttonText, onClick, to, disabled, isError, className }) {
  const variant = isError ? 'danger' : disabled ? 'secondary' : 'success';

  return (
    <Button 
      as={disabled || isError ? 'button' : Link}
      to={to}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ textAlign: 'center' }}
    >
      <span className="button-text">{buttonText}</span>
    </Button>
  );
}