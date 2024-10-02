import "./App.scss";
import Header from "./components/Header";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Login from "./Account/Login";
import Register from "./Account/Register";
import Footer from "./components/Footer";
import Events from "./Event/Events";
import PetUpdate from "./Pet_Page/PetUpdate";
import HomePage from "./components/HomePage";
import Contact from "./Contact/Contact";
import Donate from "./Donation/Donate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Routes/ProtectRoute";
import Admin from "./Account/Admin";
import Staff from "./Account/Staff";
import AppoimentTable from "./Appoinment/AppoimentTable";
import PetsList from "./Pet_Page/PetsList";
import PetDetail from "./Pet_Page/PetDetail";
import AdoptProcess from "./Adoption/AdoptProcess";

function App() {
  const roleID = localStorage.getItem("roleID")
    ? Number(localStorage.getItem("roleID"))
    : null;
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
              <Route path="/PetUpdate" element={<PetUpdate />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/petdetail/:petID" element={<PetDetail />} />
              <Route path="/adoptprocess/:petID" element={<AdoptProcess />} />

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

              <Route
                path="/appoinment"
                element={
                  <ProtectedRoute role={2}>
                    <AppoimentTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/petlist"
                element={
                  <ProtectedRoute role={3}>
                    <PetsList />
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
