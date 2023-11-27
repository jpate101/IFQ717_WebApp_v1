import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleLoginRedirect = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && userRole) {
      if (userRole === 'manager') {
        navigate('/dashboard');
      } else if (userRole === 'employee') {
        navigate('/EmployeeDashboard');
      }
    }
  }, [isLoggedIn, userRole, navigate]);

  return null;
};

export default RoleLoginRedirect;
