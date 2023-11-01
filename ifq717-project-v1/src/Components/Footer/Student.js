import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Student = ({ name, githubUrl }) => {
  return (
    <li style={{ display: 'flex', alignItems: 'center' }}>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
        <FaGithub style={{ marginRight: '0.5rem' }} />
        {name}
      </a>
    </li>
  );
};

export default Student;
