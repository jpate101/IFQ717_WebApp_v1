import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Home';
import Login from './Login/Login';
import Dashboard from './Dashboard';
import Scheduler from './Scheduler';
import EmployeeManagement from './EmployeeManagement';
import ApproveTimesheets from './Timesheets/approveTimesheets';

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
                isLoggedIn ? <Navigate to="/dashboard" /> : <Home />
              }
            />
            <Route
              path="/home"
              element={Home}
            />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? <Dashboard /> : <Navigate to="/" />
              }
            />
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="root/EmployeeManagement/*" element={<EmployeeManagement />} />
            <Route
              path="/scheduler"
              element={<Scheduler setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/Timesheets/approveTimesheets"
              element={<ApproveTimesheets setIsLoggedIn={setIsLoggedIn}/>}
            />
          </Routes>
        </Container>
        <Footer />
      </div>
    </BrowserRouter>
  );
}