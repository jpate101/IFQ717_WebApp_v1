import React from 'react';
import { Offcanvas } from 'react-bootstrap';

const UnavailabilitySidebar = ({ show, handleClose }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Unavailability</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Content for requesting leave goes here */}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default UnavailabilitySidebar;
