import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import TextField from "./Components/TextField";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // concatenate page path & params to generate a unique key
  // use key to force react to re-render the Login page when the URL changes 
  const key = location.pathname + location.search;
 
  // handle login form submission 
  const handleLogin = (event) => {
    event.preventDefault();

    // call the /token end point with provided username and password and scopes me, user & department
    const tokenUrl = process.env.REACT_APP_TANDA_TOKEN_URL;
    const scopes = 'me user department';
    const grantType = 'password';

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
      } else {
        throw new Error('Token exchange failed');
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

        // Redirect logged in user to the dashboard
        navigate('/dashboard');

        // set login state to true on login success!
        setIsLoggedIn(true);
      }
    }).catch((error) => {
      console.error('Error on swapping auth code for token: ', error);
      setMessage('An error occurred on Login. Please check credentials and try again.');
    });
  };

  // my basic login page //TODO: move to own component
  return (
    <Container key={key} fluid="lg" className="pt-2">
      <main className="flex-grow-1">
        <Row className="viewport-height-75 align-items-center">
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="mb-4 text-center">Login</h1>
            {message ? (
              <Alert variant="danger">
                {message}
              </Alert>
            ) : null}
            <Form onSubmit={handleLogin}>
              <TextField
                text="Username"
                type="text"
                onChange={setUsername}
                value={username}
              />
              <TextField
                value={password}
                text="Password"
                type="password"
                onChange={setPassword}
              />
              <Button type="submit" variant="primary" className="mt-3 login-button">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </main>
    </Container>
  );
}