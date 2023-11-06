// JSX for the progress list tasks. The function will take in the tasks as specified outside of the function. 

import React from 'react';

export default function ProgressListTask({ task }) {
  return (
    <p className="text-gray-700">{task}</p>
  );
}