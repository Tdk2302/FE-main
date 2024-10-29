import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { BASE_URL } from "../services/axios";
import "../styles/Eventdetail.scss";
import { NavLink } from "react-bootstrap";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleDonate = () => {
    navigate(`/donate`);
    localStorage.setItem("eventID", event.eventID);
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
      <img src={getImageUrl(event.img_url)} alt={event.event_name} />
      <p className="description">{event.description}</p>
      <p>Start Date: {new Date(event.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(event.end_date).toLocaleDateString()}</p>
      <p>Status: {event.status}</p>
      <button className="donate-button" onClick={handleDonate}>
        Donate now
      </button>
    </div>
  );
};

export default EventDetail;
