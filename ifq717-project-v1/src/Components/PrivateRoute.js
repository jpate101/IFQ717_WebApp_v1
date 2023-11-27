// to protect the routes that require the token/isLoggedIn state to be true 

import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ element, authorised, requiredRole, userRole, fallbackPath }) => {
  const defaultErrorMsg = "Please login to access the Tanda Launchpad";
  //const fallbackPath = "/login";
  if (authorised && (!requiredRole || requiredRole === userRole)) {
    return element;
  } else {
    // if fallback not in app.js then default to '/login'
    const path = fallbackPath || '/login';
    return <Navigate to={path} state={{ message: defaultErrorMsg }} />;
  }
};
  
  export default PrivateRoute;