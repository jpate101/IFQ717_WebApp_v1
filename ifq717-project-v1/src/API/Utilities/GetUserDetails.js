import { useState, useEffect } from 'react';
import setHeaders from './setHeaders';

function useUserDetails(token) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Fetching user details...');
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/me`, {
      headers: setHeaders()
    })
      .then(response => response.json())
      .then(data => {
        console.log('Setting user details:', data);
        setUser(data);
      })
      .catch(error => console.error(error));
  }, [token]);

  return user;
}

export default useUserDetails;