import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useTokenAuthentication({ username, password }) {
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // call the /token end point with provided username and password and scopes me, user & department
  const tokenUrl = process.env.REACT_APP_TANDA_TOKEN_URL;
  const scopes = 'me user department cost financial roster timesheet leave unavailability qualifications settings sms platform device';
  const grantType = 'password';

  const handleTokenExchange = async () => {
    try {
      const res = await fetch(tokenUrl, {
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
      });

      const data = await res.json();
      console.log('Token exchange response: ', data);

      if (res.ok) {
        // Store bearer token to cookie
        document.cookie = `token=${data.access_token}; path=/;`;
        // set login state to true on login success!
        setIsLoggedIn(true);
        // redirect to dashboard on successful login
        navigate('/dashboard');
        return true;
      } else {
        // display error on login failure
        if (res.status === 402) {
          throw new Error('Your account is locked for billing purposes. Please contact your Tanda Manager for support.');
        } else if (res.status === 409) {
          throw new Error('Your account is rate limited. Please try again in 1 minute.');
        } else {
          throw new Error(data.error_description || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Error on swapping auth code for token: ', error);
      setMessage(error.message || 'An error occurred on Login. Please check credentials and try again.');
      // set login state to false on login failure
      setIsLoggedIn(false);
      return false;
    }
  };

  return { message, isLoggedIn, handleTokenExchange };
}