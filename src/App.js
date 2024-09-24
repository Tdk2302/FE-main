import "./App.scss";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Events from "./components/Events";
import Pets from "./components/Pets";
import HomePage from "./components/HomePage";
import Contact from "./components/Contact";
import Donate from "./components/Donate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectRoute";
import Admin from "./components/Admin";
import Staff from "./components/Staff";

function App() {
  const roleID = localStorage.getItem("roleID") ? Number(localStorage.getItem("roleID")) : null;
  return (
    <>
      <div className="app-container">
        <Header roleID={roleID} />
        <div>
          <Container>
            <Routes>
            <Route path="/login" element={<Login />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/Pets" element={<Pets />} />
              <Route path="/Contact" element={<Contact />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute role={1}>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/staff"
                element={
                  <ProtectedRoute role={2}>
                    <Staff />
                  </ProtectedRoute>
                }

              />
            </Routes>
          </Container>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
