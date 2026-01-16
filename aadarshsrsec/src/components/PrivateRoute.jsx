// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If we are still checking if user is logged in, show nothing (or a spinner)
  // This prevents "flashing" the login page if the user is actually logged in
  if (currentUser === undefined) {
    return <div>Loading...</div>; 
  }

  // If no user is logged in, kick them back to login page
  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  // If user is there, show the Admin Page
  return children;
};

export default PrivateRoute;