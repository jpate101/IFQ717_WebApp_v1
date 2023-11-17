import React from 'react';
import { Offcanvas } from 'react-bootstrap';

const LeaveSidebar = ({ show, handleClose }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Request Leave</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Content for requesting leave goes here */}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default LeaveSidebar;
