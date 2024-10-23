import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./Account/Admin";
import Login from "./Account/Login";
import Register from "./Account/Register";
import Staff from "./Account/Staff";
import AdoptProcess from "./Adoption/AdoptProcess";
import "./App.scss";
import AppoimentTable from "./Appointment/AppoimentTable";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Contact from "./Contact/Contact";
import Donate from "./Donation/Donate";
import AddPetNotifications from "./Notifications/AddPetNotifications";
import BanRequestNotifications from "./Notifications/BanRequestNotifications";
import RequestRegisterNotifications from "./Notifications/RequestRegisterNotifications";
import AddPet from "./Pet_Page/AddPet";
import PetDetail from "./Pet_Page/PetDetail";
import PetsList from "./Pet_Page/PetList";
import PetListAdmin from "./Pet_Page/PetListAdmin";
import PetUpdate from "./Pet_Page/UpdatePet";
import ProtectedRoute from "./Routes/ProtectRoute";
import EventList from "./Events/EventList";
import AddEvent from "./Events/AddEvent";
import UpdateEvent from "./Events/UpdateEvent";
import Profile from "./Account/ProfileUser";
import HistoryAdoption from "./Account/HistoryAdoption";
import Report from "./Report/Report";
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
              <Route path="/events" element={<EventList />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/PetUpdate/:petID" element={<PetUpdate />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/petlist" element={<PetsList />} />
              <Route path="/petdetail/:petID" element={<PetDetail />} />
              <Route path="/adoptprocess/:petID" element={<AdoptProcess />} />
              <Route path="/report/:petID" element={<Report />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute roleID={1}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/adoptprocess/:petID"
                element={
                  <ProtectedRoute roleID={3}>
                    <AdoptProcess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/historyadoption"
                element={
                  <ProtectedRoute roleID={3}>
                    <HistoryAdoption />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff"
                element={
                  <ProtectedRoute roleID={2}>
                    <Staff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment"
                element={
                  <ProtectedRoute roleID={2}>
                    <AppoimentTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addpet"
                element={
                  <ProtectedRoute roleID={2}>
                    <AddPet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/petlistadmin"
                element={
                  <ProtectedRoute roleID={[1, 2]}>
                    <PetListAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-notifications/add-pet"
                element={
                  <ProtectedRoute roleID={1}>
                    <AddPetNotifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-notifications/request-register"
                element={
                  <ProtectedRoute roleID={1}>
                    <RequestRegisterNotifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-notifications/ban-request"
                element={
                  <ProtectedRoute roleID={1}>
                    <BanRequestNotifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/add"
                element={
                  <ProtectedRoute roleID={2}>
                    <AddEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/update/:eventID"
                element={
                  <ProtectedRoute roleID={2}>
                    <UpdateEvent />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />
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
