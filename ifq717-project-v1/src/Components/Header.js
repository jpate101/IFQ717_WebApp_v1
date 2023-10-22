import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useResolvedPath, useMatch, useLocation } from "react-router-dom";
import '../style.css';

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

  if (location.pathname === '/callback') {
    return null;
  }

  return (
    <header className="admin-header">
      <Navbar expand="md" variant="dark">
        <Container fluid>
          <Navbar.Brand href="#">Tanda</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />
          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="me-auto">
              <HighlightLink to="/" as={Link}>
                Home
              </HighlightLink>
              {isLoggedIn ? (
                <>
                  <HighlightLink to="/teams" as={Link}>
                    Teams
                  </HighlightLink>
                  <HighlightLink to="/locations" as={Link}>
                    Locations
                  </HighlightLink>
                  <HighlightLink to="/users" as={Link}>
                    Users
                  </HighlightLink>
                  <HighlightLink to="/onboard-users" as={Link}>
                    Onboard users
                  </HighlightLink>
                  <HighlightLink to="/create-rosters" as={Link}>
                    Create
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