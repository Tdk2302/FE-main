import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoApp from "../assets/images/logo.png";
import { useLocation, NavLink } from "react-router-dom";
import "../styles/header.scss";
import { useState, useEffect } from "react";

const Header = (props) => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      console.log("loginChange: ", loggedIn);
    };
    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Navbar expand="lg" className="header">
      {/* Logo */}
      <Navbar.Brand className="logo" href="/">
        <img
          src={logoApp}
          width="45"
          height="45"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
        <p>FurryFriendsFund</p>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {/* Thanh menu */}
        <Nav className="me-auto" activeKey={location.pathname}>
          <NavLink to="/" className="nav-link">
            <h3>Home</h3>
          </NavLink>
          <NavLink to="/adopt" className="nav-link">
            <h3>Adopt</h3>
          </NavLink>
          <NavLink to="/events" className="nav-link">
            <h3>Events</h3>
          </NavLink>
          <NavLink to="/pets" className="nav-link">
            <h3>Pets</h3>
          </NavLink>
          <NavLink to="/donate" className="nav-link">
            <h3>Donate</h3>
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            <h3>Contact</h3>
          </NavLink>
        </Nav>
        {/* Đổi đăng nhập và đăng ký thành profile */}
        <Nav className="settings">
          {isLoggedIn ? (
            <NavDropdown title="Settings" id="basic-nav-dropdown">
              <NavDropdown.Item as={NavLink} to="/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                <h3>Login</h3>
              </NavLink>
              <NavLink to="/register" className="nav-link">
                <h3>Register</h3>
              </NavLink>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
