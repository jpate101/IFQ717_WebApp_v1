// Re-usable Task styled button component. Can provide own text & nav. 
// Can use like: <LabelledButton buttonText={taskName} href={href} /> 

import React from 'react';
import { Link } from 'react-router-dom';
import '../../style.css';
import '../../index.css';

export default function LabelledButton({ buttonText, to }) {
  return (
    <Link to={to} style={{ backgroundColor: 'var(--background-color)', color: 'var(--primary-color)', border: `1px solid var(--primary-color)`, padding: '0.5rem 1rem', borderRadius: '0.25rem', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out' }} 
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'white';
        e.target.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'var(--background-color)';
        e.target.style.boxShadow = '0 1px 1px rgba(0, 0, 0, 0.05)';
      }}
    >
      {buttonText}</Link>
  );
}

