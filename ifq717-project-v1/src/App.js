import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Home';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import EmployeeManagement from './EmployeeManagement';
import ApproveTimesheets from './Timesheets/approveTimesheets';
import ExportTimesheets from './Timesheets/exportTimesheets'
import Roster from './Roster/Roster';
import TimesheetForUser from './Timesheets/TimesheetForUser';
import PrivateRoute from './Components/PrivateRoute';
import EmployeeLeave from './Employee/EmployeeLeave';
import EmployeeRoster from './Employee/EmployeeRoster';
import EmployeeDashboard from './Employee/EmployeeDashboard';

export default function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.token);

  useEffect(() => {
    setIsLoggedIn(!!cookies.token);
  }, [cookies.token]);

  const handleLogOut = () => {
    removeCookie('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column bg-light" id="wrapper">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogOut={handleLogOut} />
        <Container fluid className="pt-2">
          <Routes>
            <Route
              path="/"
              element={
                <Home />
              }
            />
            <Route
              path="/home"
              element={Home}
            />
            <Route path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />}
              authorised={isLoggedIn} />}
            />
            <Route
              path="/root/EmployeeManagement/*" 
              element={<PrivateRoute element={<EmployeeManagement />}
              authorised={isLoggedIn} />}
            />
            <Route
              path="/roster"
              element={<PrivateRoute element={<Roster />}
              authorised={isLoggedIn} />}
            />
            <Route
              path="/Timesheets/approveTimesheets"
              element={<PrivateRoute element={<ApproveTimesheets />}
              authorised={isLoggedIn} />}
            />
            <Route
              path="Timesheets/:userId"
              element={<PrivateRoute element={<TimesheetForUser />}
              authorised={isLoggedIn} />}
            />
            <Route
              path="/Timesheets/exportTimesheets"
              element={<PrivateRoute element={<ExportTimesheets />}
              authorised={isLoggedIn} />}
            />
            <Route
              path="/Leave"
              element={<PrivateRoute element={<EmployeeLeave />}
              authorised={isLoggedIn} />}
            />
            <Route
              path="/EmployeeDashboard"
              element={<PrivateRoute element={<EmployeeDashboard />}
              authorised={isLoggedIn} />}
            />
            <Route
              path="/EmployeeRoster"
              element={<PrivateRoute element={<EmployeeRoster />}
              authorised={isLoggedIn} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </BrowserRouter>
  );
}