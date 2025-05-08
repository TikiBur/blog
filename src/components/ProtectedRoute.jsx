import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ element, ...rest }) => {
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Проверка авторизации...</p>;

  return user ? element : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;