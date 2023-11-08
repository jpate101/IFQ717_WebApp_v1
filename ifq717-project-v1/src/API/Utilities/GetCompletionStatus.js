import { useState, useEffect } from 'react';
import { getCompletionStatus } from './GetCompletionStatus';

function useCompletionStatus() {
  const [isLocations, setIsLocations] = useState(false);
  const [isUsers, setIsUsers] = useState(false);

  useEffect(() => {
    const { isLocations, isUsers } = getCompletionStatus();
    setIsLocations(isLocations);
    setIsUsers(isUsers);
  }, []);

  return { isLocations, isUsers };
}

export default useCompletionStatus;