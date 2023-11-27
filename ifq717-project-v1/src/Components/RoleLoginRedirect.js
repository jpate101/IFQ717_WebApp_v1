import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleLoginRedirect = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userRole && !hasRedirected) {
      if (userRole === 'manager') {
        navigate('/dashboard');
      } else if (userRole === 'employee') {
        navigate('/EmployeeDashboard');
      }
      setHasRedirected(true);
    }
  }, [isLoggedIn, userRole, navigate, hasRedirected]);

  return null;
};

export default RoleLoginRedirect;