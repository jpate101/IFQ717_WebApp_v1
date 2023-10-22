import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import dotenv from 'dotenv'; TODO - share credentials using dotenv

//dotenv.config(); TODO - share credentials using dotenv

export default function Callback({ setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Callback useEffect hook reached');
    checkAuthorizationCode();
  }, []);

  const checkAuthorizationCode = () => {
    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");

    if (authorizationCode) {
      console.log('Authorization code found:', authorizationCode);
      sessionStorage.setItem('authorizationCode', authorizationCode);
      handleTokenExchange(authorizationCode);
    }
    else {
      console.log('Authorization code not found in query parameter');
    }
  };

  const handleTokenExchange = (authorizationCode) => {
    console.log('Exchanging authorization code for token');
    const tokenUrl = process.env.REACT_APP_TANDA_TOKEN_URL;
  
    console.log('Calling Tanda token end point with authorization code:', authorizationCode);
  
    fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        code: authorizationCode,
        redirect_uri: 'http://localhost:3000/callback',
        grant_type: 'authorization_code',
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Token exchange failed');
        }
      })
      .then((data) => {
        console.log(`Token exchange response: `, data);
        if (data.error) {
          console.error('Token exchange error:', data.error);
        } else {
          // Save the token to a cookie
          document.cookie = `token=${data.access_token}; path=/;`;
  
          setIsLoggedIn(true);
          console.log('setting the isLoggedIn value to:', true);
  
          // Redirect logged in user to the dashboard
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Unable to exchange code for token:', error);
        // TODO: handle where to redirect user if error and handle showing pretty error message etc
      });
  };

  return (
    <>
      <h1>Fetching token...</h1>
      <p>make this page pretty! but dont allow user to navigate away</p>
    </>
  );
}
