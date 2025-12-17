import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;