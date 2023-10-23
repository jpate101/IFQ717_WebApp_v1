import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import TextField from "./Components/TextField";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const key = location.pathname + location.search;

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
            <Form>
              <TextField
                text="Email"
                type="email"
                onChange={setEmail}
                value={email}
              />
              <TextField
                value={password}
                text="Password"
                type="password"
                onChange={setPassword}
              />
              <Button onClick={() => {
                // Redirect user to the authorization endpoint
                const authorizationUrl =
                  `https://my.tanda.co/api/oauth/authorize?scope=me+user&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&response_type=code`; 
                window.location.href = authorizationUrl;
              }} variant="primary" className="mt-3 login-button">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </main>
    </Container>
  );
}