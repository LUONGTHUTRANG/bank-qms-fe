import { Navigate, Outlet, useLocation } from 'react-router';

export default function ProtectedRoute() {
  const token = localStorage.getItem('access_token');
  const location = useLocation();

  if (!token) {
    // Redirect to login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/counter/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}