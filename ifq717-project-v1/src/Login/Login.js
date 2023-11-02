import { Container, Row, Col, Form, Button, Alert, Image, Card } from "react-bootstrap";
import TextField from "../Components/TextField";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './login.css';
import '../Resources/iStock-Chefs.jpg';
import '../Resources/logo-white.svg';

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
    const scopes = 'me user department cost financial';
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
    <Container fluid="lg" className="login-container">
      <Row>
        {/* Column 1 (visible on all devices) */}
        <Col xs={12} lg={6} className="d-flex align-items-center justify-content-center login-screen-column-1">
          <div className = "login-form">
            {message ? (
              <Alert variant="danger">
                {message}
              </Alert>
            ) : null}
            <Form onSubmit={handleLogin} >
              <TextField
                value={username}
                label="Username:"
                placeholder="Enter username (valid email address)"
                id="Username"
                type="input"
                onChange={setUsername}
                className="login-fields"
                
              />
              <TextField
                value={password}
                label="Password:"
                placeholder="Enter password"
                id="Password"
                type="password"
                onChange={setPassword}
                className="login-fields"
               
              />
              <Button type="submit" variant="primary" className="mt-3 login-button">
                Login
              </Button>
            </Form>
          </div>
        </Col>

        {/* Column 2 (visible on large devices) */}
        <Col lg={6} className="d-none d-lg-block">
          <div className="d-flex flex-column justify-content-center h-100">
            <div className="background-image-container">
              <Image src={require('../Resources/logo-white.svg').default} alt="Logo" className="login-enticer-logo" />
              <Card className="mb-4" style={{ maxWidth: '50%' }}>
                <Card.Body>
                  <Card.Title>Card 1</Card.Title>
                  <Card.Text>Content for Card 1.</Card.Text>
                </Card.Body>
              </Card>
              <Card style={{ maxWidth: '50%' }}>
                <Card.Body>
                  <Card.Title>Card 2</Card.Title>
                  <Card.Text>Content for Card 2.</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}