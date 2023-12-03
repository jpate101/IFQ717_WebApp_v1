import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleLoginRedirect = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const justLoggedIn = localStorage.getItem('justLoggedIn');
    if (isLoggedIn && userRole && justLoggedIn === 'true') {
      if (userRole === 'manager') {
        navigate('/dashboard');
      } else if (userRole === 'employee') {
        navigate('/EmployeeDashboard');
      }
      localStorage.removeItem('justLoggedIn');
    }
  }, [isLoggedIn, userRole, navigate]);

  return null;
};

export default RoleLoginRedirect;