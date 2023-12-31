import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useResolvedPath, useMatch, useLocation, NavLink } from "react-router-dom";
import '../style.css';
import './../Resources/logo-navy.svg';

function HighlightLink(props) {
  let resolved = useResolvedPath(props.to);
  let match = useMatch({ path: resolved.pathname, end: true });
  return <Nav.Link {...props} active={match} />;
}

export default function Header({ isLoggedIn, setIsLoggedIn, userRole }) {
  console.log("the header isLoggedIn state is:", isLoggedIn);
  const handleLogOut = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="admin-header bg-background text-primary">
      <Navbar expand="md" >
        <Container fluid className="tanda-launchpad-header">
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img
              src={require("./../Resources/logo-navy.svg").default}
              alt="tanda-navy-logo"
              className="admin-header-logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto">
            <HighlightLink to={isLoggedIn ? (userRole === 'manager' ? '/dashboard' : '/EmployeeDashboard') : '/'} as={Link}>
            {isLoggedIn ? (userRole === 'manager' ? 'Dashboard' : 'Employee Dashboard - WIP') : 'Home'}
              </HighlightLink>
              {isLoggedIn && userRole === 'manager' && (
                <>
                  <HighlightLink to="root/EmployeeManagement/" as={Link}>
                    Employee Management
                  </HighlightLink>
                  <HighlightLink to="/Qualifications" as={Link}>
                    Qualifications
                  </HighlightLink>
                  <HighlightLink to="/roster" as={Link}>
                    Roster
                  </HighlightLink>
                  <HighlightLink to="/Leave" as={Link}>
                    Leave
                  </HighlightLink>
                  <HighlightLink to="/ClockIn" as={Link}>
                    Clockins
                  </HighlightLink>
                  <HighlightLink to="/Compliance" as={Link}>
                    Compliance
                  </HighlightLink>
                  <NavDropdown title="Timesheets" id="timesheets-nav-dropdown" className="timesheets-nav-dropdown">
                    <NavDropdown.Item as={NavLink} to="/Timesheets/approveTimesheets" className="dropdown-item">
                      Approve Timesheets
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/Timesheets/exportTimesheets" className="dropdown-item">
                      Export Timesheets
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
              {isLoggedIn && userRole === 'employee' && (
                <>
                  <HighlightLink to="/EmployeeLeave" as={Link}>
                    Leave
                  </HighlightLink>
                  <HighlightLink to="/EmployeeRoster" as={Link}>
                    Roster - WIP
                  </HighlightLink>    
                </>
              )}
              </Nav>
              <div className="ml-auto mr-2">
                {isLoggedIn ? (
                  <HighlightLink to="/" as={Link} onClick={handleLogOut}>
                    Logout
                  </HighlightLink>
                ) : (
                  <HighlightLink to="/login" as={Link}>
                    Login
                  </HighlightLink>
                )}
              </div>
            </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}