import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { BASE_URL } from "../services/axios";
import "../styles/Eventdetail.scss";
import { NavLink } from "react-bootstrap";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const roleID = localStorage.getItem("roleID");
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await api.get(`/events/${eventId}/getEventById`, {
          params: { eventId: eventId },
        });
        if (response.data.status === 200) {
          setEvent(response.data.data);
        } else {
          toast.error("Failed to load event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("An error occurred while loading event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get(`/donation/getDonateByEvent/${eventId}`);
        if (response.data.status === 200) {
          setDonations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
        toast.error("Failed to load donation history");
      }
    };

    if (eventId) {
      fetchDonations();
    }
  }, [eventId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDonate = () => {
    navigate(`/donate`);
    sessionStorage.setItem("eventID", event.eventID);
  };

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("images\\"))
      return `${BASE_URL}${imgUrl.replace("\\", "/")}`;
    return imgUrl;
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="event-detail">
      <h1>{event.event_name}</h1>
      <img
        src={getImageUrl(event.img_url)}
        alt={event.event_name}
        style={{ width: "50%", height: "50%" }}
      />
      <p className="description">{event.description}</p>
      <p>Start Date: {new Date(event.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(event.end_date).toLocaleDateString()}</p>
      <p>Status: {event.status}</p>
      {roleID === "3" && (
        <button className="donate-button" onClick={handleDonate}>
          Donate now
        </button>
      )}

      <div className="donation-history" style={{ marginTop: "2rem" }}>
        <h2>Donation History</h2>
        <Paper sx={{ width: "50%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <h4>Date</h4>
                  </TableCell>
                  <TableCell>
                    <h4>Account ID</h4>
                  </TableCell>
                  <TableCell align="right">
                    <h4>Amount</h4>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((donation, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>
                        {new Date(donation.date_time).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell>{donation.accountID || "Anonymous"}</TableCell>
                      <TableCell align="right">${donation.amount}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={donations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

export default EventDetail;
