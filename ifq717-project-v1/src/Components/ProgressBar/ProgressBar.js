import React from 'react';

function ProgressBar({ progress }) {
  return (
    <>
      <h4 className="text-md mb-2 mt-4 secondary text-center">Launch countdown</h4>
      <div className="w-full h-4 mb-4 bg-gray-200 rounded-full dark:bg-gray-700 relative">
        <div className="h-4 bg-blue-600 rounded-full dark:bg-blue-500" style={{ width: `${progress}%` }}>
          <div className="text-black text-xs font-bold absolute top-0 left-10 right-0 bottom-0 flex items-center justify-center">{`${progress}%`}</div>
        </div>
      </div>
    </>
  );
}

export default ProgressBar;