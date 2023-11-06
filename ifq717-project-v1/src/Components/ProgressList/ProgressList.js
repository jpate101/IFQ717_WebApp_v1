// The organisation onboarding overview progression list grid code

import React from 'react';
import ProgressListIcon from './ProgressListIcon';
import ProgressListTask from './ProgressListTask';
import ProgressListProgression from './ProgressListProgression';

export default function ProgressList({ tasks }) {
  return (
    <div className="flex flex-col mt-4 overflow-hidden align-items-center">
      {tasks.map((task, index) => (
        <div key={index} className="bg-white p-2 flex-grow-0 flex-shrink-0 w-full" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
          <div className="flex flex-row items-center">
            <div className="mr-2">
              <ProgressListIcon />
            </div>
            <div className="flex-grow-1 flex-shrink-0">
              <ProgressListTask task={task.taskname} />
            </div>
            <div className="ml-2">
              <ProgressListProgression completion={task.completion} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}