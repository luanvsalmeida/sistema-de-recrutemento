import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LandPage from './pages/landpage';
import AuthPage from './pages/auth';
import NotFoundPage from './pages/NotFound';
import Form from './pages/form';
import ProtectedRoute from './components/ProtectedRoute'; // importe o ProtectedRoute

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <LandPage />
      </ProtectedRoute>
    ),
      errorElement: <NotFoundPage />
    
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/form',
    element: (
      <ProtectedRoute>
        <Form />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
