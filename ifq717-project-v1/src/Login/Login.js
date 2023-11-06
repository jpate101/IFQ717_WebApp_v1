import { Container, Row, Col, Form, Button, Alert, Image, Card } from "react-bootstrap";
import TextField from "../Components/TextField";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './login.css';
import '../Resources/iStock-Chefs.jpg';
import '../Resources/logo-white.svg';
import ExchangeToken from "../API/Utilities/ExchangeToken";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  // concatenate page path & params to generate a unique key
  // use key to force react to re-render the Login page when the URL changes 
  const key = location.pathname + location.search;

  const { message, isLoggedIn, handleTokenExchange } = ExchangeToken({ username, password });

  // handle login form submission 
  const handleLogin = (event) => {
    event.preventDefault();
    handleTokenExchange();
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
              <Card className ="mb-4 login-enticer-card">
              <Card.Body>
                <Card.Title className="login-enticer-heading">Tanda Launchpad</Card.Title>
                <div>
                  <div className="flex items-top">
                    <img src="/Summary.svg" alt="Summary Icon" className="mr-2 h-5 w-5 login-enticer-fill-primary" />
                    <span>Organisation onboarding overview</span>
                  </div>
                  <div className="flex items-center">
                    <img src="/Worker.svg" alt="Worker Icon" className="mr-2 h-5 w-5 login-enticer-fill-primary" />
                    <div className="d-flex align-items-top">
                      <span>Workforce management</span>
                    </div>
                  </div>
                  <div className="ml-7 lighter-font">
                    <div>Manage locations, staff & teams</div>
                  </div>
                  <div className="flex items-center">
                    <img src="/Calendar-Days.svg" alt="Timesheet Icon" className="mr-2 h-5 w-5 login-enticer-fill-primary" />
                    <div className="d-flex align-items-center">
                      <span>Schedule management</span>
                    </div>
                  </div>
                  <div className="ml-7 lighter-font">
                    <div>Create, edit, approve & export timesheets</div>
                  </div>
                </div>
              </Card.Body>
              </Card>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}