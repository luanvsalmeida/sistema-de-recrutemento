import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('accessToken'); // Verifica se há um token

    return isAuthenticated ? children : <Navigate to="/auth" />; // Redireciona para o login se não estiver autenticado
};

export default ProtectedRoute;
