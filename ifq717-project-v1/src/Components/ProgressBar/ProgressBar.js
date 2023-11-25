import React from 'react';
import '../../Dashboard/dashboard.css';
import MinimalRocketIcon from '../Icons/MinimalRocketIcon'; // Corrected import path

function ProgressBar({ progress }) {
  return (
    <>
      <h4 className="text-md mb-2 mt-4 secondary text-center">Countdown to launch</h4>
      <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700 relative">
        <div className="progress-bar-background">
          <div className="task-progress-bar rounded-full" style={{ width: `${progress}%` }}>
            <div className="text-black text-xs font-bold absolute top-2 left-10 right-0 bottom-0 flex items-center justify-center">{`${progress}%`}</div>
            <div className="rocket-icon-container">
            <MinimalRocketIcon size='40' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProgressBar;