import React from 'react';
import { Container } from 'react-bootstrap';
import ClockInUserGrid from './ClockInUserGrid';

function ClockIn() {
  return (
    <Container className="clockin-container">
      <ClockInUserGrid /> 
    </Container>
  );
}

export default ClockIn;