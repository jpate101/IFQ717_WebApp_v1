import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();

  if (location.pathname === '/callback') {
    return null;
  }

  return <div className="footer-style">Footer</div>;
}

export default Footer;