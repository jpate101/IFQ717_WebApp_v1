import React, { useState, useEffect } from 'react';
import tasks from './TaskOptions';
import TaskIcon from './TaskIcon';
import TaskButton from './TaskButton';
import ProgressBar from '../ProgressBar/ProgressBar';

function TaskList() {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskStatus = async () => {
      try {
        const updatedTaskList = await Promise.all(
          tasks.map(async (task) => {
            try {
              const data = await task.fetchFunction();
              const isComplete = task.completionCriteria(data);
              console.log(`Data for ${task.name}:`, data);
              console.log(`isComplete for ${task.name}:`, isComplete);

              return {
                ...task,
                isComplete,
              };
            } catch (err) {
              console.error(`Error fetching ${task.name}:`, err);
              return task;
            }
          })
        );

        //console.log("Hey Updating Task List", updatedTaskList);
        setTaskList(updatedTaskList);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchTaskStatus();
  }, []);

  // calculating the progress bar for the launch checklist 
  const completedTasks = taskList.filter(task => task.isComplete);
  const progress = ((completedTasks.length / taskList.length) * 100).toFixed(2);

  // JSX for the task list TODO - maybe put a rocket icon for the launch slider 
  return (
    <div className="flex flex-col mt-4 overflow-hidden align-items-center">
      {isLoading && (
        <div className="text-center">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-500">Error: {error.message}</div>
      )}
      {!isLoading && !error && (
        <div className="w-full">
          {taskList.map((task, index) => (
            <div key={index} className="bg-white p-2 flex-grow-0 flex-shrink-0 w-full" style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
              <div className="flex flex-row items-center">
                <div className="mr-2">
                  <TaskIcon isComplete={task.isComplete} />
                </div>
                <div className="flex-grow-1 flex-shrink-0">
                  {task.name}
                </div>
                <div className="ml-2">
                  <TaskButton taskName={task.name} isComplete={task.isComplete} />
                </div>
              </div>
            </div>
          ))}
          <ProgressBar progress={progress} />
        </div>
      )}
    </div>
  );
}

export default TaskList;