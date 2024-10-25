import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { BASE_URL } from "../services/axios";
import "../styles/events.scss";
import { toast } from "react-toastify";
import { Card, Button, CardGroup } from "react-bootstrap";
import Spinner from "../components/Spinner";
// Thêm các import mới
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MoreVert from "@mui/icons-material/MoreVert";
import DeleteDialog from "../components/DeleteDialog";
import EventStatusDot from "../components/EventStatusDot";

const EventList = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const roleID = localStorage.getItem("roleID");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(12);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    console.log("Current roleID:", roleID); // Thêm dòng này  
    fetchEvents();
  }, [roleID]);

  useEffect(() => {
    const state = location.state;
    if (state && state.updated) {
      fetchEvents();
      // Clear the state after fetching
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      let response;
      if (roleID === "1" || roleID === "2") {
        response = await api.get("/events/showEventAdmin");
      } else {
        response = await api.get("/events/showEvents");
      }
      if (response.data.status === 200) {  // Kiểm tra status
        setEvents(response.data.data);
      } else {
        toast.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = () => {
    navigate("/events/add");
  };

  const handleUpdateEvent = (eventID) => {
    console.log("Updating event with ID:", eventID); // Thêm dòng này
    if (eventID) {
      navigate(`/events/update/${eventID}`);
    } else {
      toast.error("Không thể cập nhật sự kiện. ID sự kiện không hợp lệ.");
    }
  };

  const handleDeleteEvent = async (eventID) => {
    if (!eventID) {
      toast.error("Không thể xóa sự kiện. ID sự kiện không hợp lệ.");
      return;
    }
    setEventToDelete(eventID);
    setOpenDeleteDialog(true);
  };

  const handleMenuOpen = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };

  const handleDeleteClick = (eventID) => {
    setEventToDelete(eventID);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    deleteEvent(eventToDelete);
  };

  const deleteEvent = async (eventID) => {
    try {
      const response = await api.delete(`/events/${eventID}/deleteEvents`);
      if (response.data.status === 200) {  // Kiểm tra status thay vì success
        if (response.data.data) {
          toast.success("Event status changed to Ending");
        } else {
          toast.success("Event deleted successfully");
        }
        fetchEvents();  // Cập nhật danh sách sự kiện
        setCurrentPage(1);  // Reset về trang đầu tiên
      } else {
        toast.error(response.data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      if (error.response && error.response.status === 409) {
        toast.error(
          "Cannot delete the event. It may be referenced by other data."
        );
      } else {
        toast.error(error.response?.data?.message || "Failed to delete event. Please try again.");
      }
    }
    handleCloseDeleteDialog();
  };

  const handleMenuAction = (action) => {
    if (action === "update") {
      handleUpdateEvent(selectedEventId);
    } else if (action === "delete") {
      handleDeleteEvent(selectedEventId);
    }
    handleMenuClose();
  };

  // Get current events
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getEventStatus = (event) => {
    return event.status; // Trả về trạng thái trực tiếp từ dữ liệu sự kiện
  };

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="event-list-container">
      <h1 className="mb-4">Events List</h1>
      {roleID === "2" && (
        <Button onClick={handleAddEvent} className="mb-4 event-button">
          Add New Event
        </Button>
      )}
      <CardGroup>
        {currentEvents.map((event) => (
          <Card key={event.eventID} className="mb-4">
            {(roleID === "1" || roleID === "2") && (
              <div className="dropdown-wrapper">
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{
                      root: { variant: "outlined", color: "neutral" },
                    }}
                    onClick={(e) => handleMenuOpen(e, event.eventID)}
                  >
                    <MoreVert />
                  </MenuButton>
                  <Menu>
                    {roleID === "2" && (
                      <MenuItem onClick={() => handleMenuAction("update")}>
                        Update
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleMenuAction("delete")}>
                      Delete
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </div>
            )}
            <Card.Img variant="top" src={getImageUrl(event.img_url)} alt={event.title} />
            <Card.Body>
              <Card.Title>
                {event.event_name}
                <EventStatusDot status={getEventStatus(event)} />
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {event.title}
              </Card.Subtitle>
              <Card.Text>{event.description}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">
                Start Date: {new Date(event.start_date).toLocaleDateString()}
              </small>
              <br />
              <small className="text-muted">
                End Date: {new Date(event.end_date).toLocaleDateString()}
              </small>
              <br />
              <small className={`text-${event.status === 'Ending' ? 'danger' : 'success'}`}>
                Status: {event.status}
              </small>
            </Card.Footer>
          </Card>
        ))}
      </CardGroup>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(events.length / eventsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        itemName="Event"
      />
    </div>
  );
};

export default EventList;
