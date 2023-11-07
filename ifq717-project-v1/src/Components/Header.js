import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
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
              <HighlightLink to="/" as={Link}>
                 {isLoggedIn ? 'Dashboard' : 'Home'}
              </HighlightLink>
              {isLoggedIn ? (
                <>
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link} id=''>
                    Timesheets
                  </Dropdown.Toggle>
                  <Dropdown.Menu className = "header-dropdown-toggle">
                    <Dropdown.Item as={Link} to='/Timesheets/exportTimesheets' className="header-dropdown-toggle text-primary">
                      Export Timesheets
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to='/Timesheets/approveTimesheets' className="header-dropdown-toggle text-primary">
                      Approve Timesheets
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                  <HighlightLink to="/onboard-users" as={Link}>
                    Onboard users
                  </HighlightLink>
                  <HighlightLink to="/roster" as={Link}>
                    Create schedules
                  </HighlightLink>
                  <HighlightLink to="root/EmployeeManagement/" as={Link}>
                    Employee Management
                  </HighlightLink>
                  <HighlightLink to="/" as={Link} onClick={handleLogOut}>
                    Logout
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