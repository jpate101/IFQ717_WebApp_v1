// Handle the errors listed in Tanda API doco that may need to be re-used in multiple places

import React from 'react';
import { Alert } from 'react-bootstrap';

export default function HandleErrors({ status, message }) {
  if (status === 402) {
    return (
      <Alert variant="danger">
        Your account is locked for billing purposes. Please contact your Tanda Manager.
      </Alert>
    );
  } else if (status === 429) {
    return (
      <Alert variant="danger">
        Your account is rate limited. Please try again after 1 minute.
      </Alert>
    );
  } else {
    return (
      <Alert variant="danger">
        Error {status}: {message}
      </Alert>
    );
  }
}