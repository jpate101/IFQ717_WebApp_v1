import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useTokenAuthentication({ username, password }) {
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // call the /token end point with provided username and password and scopes me, user & department
  const tokenUrl = process.env.REACT_APP_TANDA_TOKEN_URL;
  const scopes = 'me user department cost financial roster timesheet leave unavailability qualifications settings sms platform';
  const grantType = 'password';

  const handleTokenExchange = () => {
    fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: new URLSearchParams({
        username: username,
        password: password,
        scope: scopes,
        grant_type: grantType
      })
    }).then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 402) {
          throw new Error('Your account is locked for billing purposes. Please contact your Tanda Manager for support.');
        } else if (res.status === 409) {
          throw new Error('Your account is rate limited. Please try again in 1 minute.');
        }
      }).then((data) => {
      console.log('Token exchange response: ', data);
      if (data.error) {
        console.error('Token exchange error: ', data.error);

        // display error on login failure 
        setMessage(data.error_description);

        // set login state to false on login failure
        setIsLoggedIn(false);
      } else {
        // Store bearer token to cookie
        document.cookie = `token=${data.access_token}; path=/;`;

        // set login state to true on login success!
        setIsLoggedIn(true);

        // redirect to dashboard on successful login
        navigate('/dashboard');
      }
    }).catch((error) => {
      console.error('Error on swapping auth code for token: ', error);
      setMessage('An error occurred on Login. Please check credentials and try again.');
    });
  };

  return { message, isLoggedIn, handleTokenExchange };
}