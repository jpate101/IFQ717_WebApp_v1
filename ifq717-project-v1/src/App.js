import logo from './logo.svg';
import './App.css';
import "./style.css";//added

import { BrowserRouter, Routes, Route } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

import EmployeeManagement from "./EmployeeManagement";

const Login = () => {
  return (
    <div className="">
      Login
    </div>
  );
 };

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Header />
          {/* the content */}
          <Routes className="">
            <Route path="root/Login" element={<Login />} />
            <Route path="root/EmployeeManagement/*" element={<EmployeeManagement />} />
          </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}




export default App;
