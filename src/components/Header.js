import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logoApp from "../assets/images/logo.webp";
import { useLocation, NavLink } from "react-router-dom";
import "../styles/header.scss";

const Header = (props) => {
  const location = useLocation;

  return (
    <Navbar expand="lg" className="header">
      <Navbar.Brand className="logo" href="/">
        <img
          src={logoApp}
          width="60"
          height="60"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
        <p>FurryFriendsFund</p>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" activeKey={location.pathname}>
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/adopt" className="nav-link">
            Adopt
          </NavLink>
          <NavLink to="/events" className="nav-link">
            Events
          </NavLink>
          <NavLink to="/pets" className="nav-link">
            Pets
          </NavLink>
          <NavLink to="/donate" className="nav-link">
            Donate
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
        </Nav>
        <Nav className="login-regist">
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
          <NavLink to="/register" className="nav-link">
            Register
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
