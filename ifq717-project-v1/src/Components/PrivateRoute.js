// to protect the routes that require the token/isLoggedIn state to be true 

import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ element, authorised, fallbackPath }) => {
  const defaultErrorMsg = "Please login to access the Tanda Launchpad";
  //const fallbackPath = "/login";
  if (authorised) {
    return element;
  } else {
    // if fallback not in app.js then default to '/login'
    const path = fallbackPath || '/login';
    return <Navigate to={path} state={{ message: defaultErrorMsg }} />;
  }
};
  
  export default PrivateRoute;