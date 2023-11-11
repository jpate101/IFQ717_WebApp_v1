import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useResolvedPath, useMatch, useLocation } from "react-router-dom";
import '../style.css';
import './../Resources/logo-navy.svg';

function HighlightLink(props) {
  let resolved = useResolvedPath(props.to);
  let match = useMatch({ path: resolved.pathname, end: true });
  return <Nav.Link {...props} active={match} />;
}

export default function Header({ isLoggedIn, setIsLoggedIn }) {
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
        <Container fluid>
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
              <HighlightLink to={isLoggedIn ? '/dashboard' : '/'} as={Link}>
              {isLoggedIn ? 'Dashboard' : 'Home'}
              </HighlightLink>
              {isLoggedIn ? (
                <>
                  <HighlightLink to="root/EmployeeManagement/" as={Link}>
                    Employee Management
                  </HighlightLink>
                  <HighlightLink to="/onboard-users" as={Link}>
                    Onboard users
                  </HighlightLink>
                  <HighlightLink to="/roster" as={Link}>
                    Create schedules
                  </HighlightLink>
                  <NavDropdown title="Timesheets" id="timesheets-nav-dropdown" className="timesheets-nav-dropdown lg:-mr-44 md: -mr-24">
                    <NavDropdown.Item href="/Timesheets/approveTimesheets" className="timesheets-nav-dropdown text-primary">
                      Approve Timesheets
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/Timesheets/exportTimesheets" className="timesheets-nav-dropdown text-primary">
                      Export Timesheets
                    </NavDropdown.Item>
                  </NavDropdown>
                  <HighlightLink to="/" as={Link} onClick={handleLogOut} className="ml-32">
                    Logout - W.I.P
                  </HighlightLink>
                </>
              ) : (
                <HighlightLink to="/login" as={Link}>
                  Login 
                </HighlightLink>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}