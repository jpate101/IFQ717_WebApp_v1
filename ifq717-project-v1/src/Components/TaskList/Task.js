// JSX for the progress list tasks. The function will take in the tasks as specified outside of the function. 

import React from 'react';
import TaskIcon from './TaskIcon';
import TaskButton from './TaskButton';

export default function Task({ taskName, taskLabel, isComplete }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <TaskIcon isComplete={isComplete} />
      </div>
      <div>{taskName}</div>
      <div>
      <TaskButton taskLabel={taskLabel} isComplete={isComplete} />
      </div>
    </div>
  );
}