// Function to dynamically display the task list status as a prompt to navigate to get the job done or to find information relevant after job done

import React from 'react';

export default function ProgressListProgression({ completion }) {
  return (
    <p className="text-gray-700">{completion}</p>
  );
}