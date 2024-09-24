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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./routes/ProtectedRoute";
function App() {
  return (
    <>
      <div className="app-container">
        <Header />
        <div>
          <Container>
            <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events" element={<Events />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/" element={<HomePage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/donate" element={<Donate />} />
              <Route path="/Pets" element={<Pets />} />
              </Route>
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
