import { useState, useEffect } from 'react';
import SetHeaders from './SetHeaders';

function GetUserDetails(token) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Fetching user details...');
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/me`, {
      headers: SetHeaders()
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

export default GetUserDetails;