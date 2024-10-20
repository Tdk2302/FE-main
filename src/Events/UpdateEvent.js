import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/axios';
import "../styles/updateevent.scss";
import { toast } from 'react-toastify';
import Spinner from "../components/Spinner";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const UpdateEvent = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState({
    event_name: '',
    description: '',
    start_date: '',
    end_date: '',
    img_url: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await api.get(`/events/${eventID}`);
        setEventData(response.data.data);
        setImagePreview(response.data.data.img_url);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error('Failed to fetch event data');
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [eventID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventData(prev => ({
      ...prev,
      img_url: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    for (const key in eventData) {
      formData.append(key, eventData[key]);
    }

    try {
      await api.put(`/events/${eventID}/updateEvents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success('Event updated successfully');
      navigate('/events');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container className="update-event-container">
      <h1 className="update-event__title">UPDATE EVENT</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={6} md={6} sm={12} className="text-center">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Event Image</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleImageChange}
                accept="image/*"
              />
            </Form.Group>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Event Preview"
                className="img-preview"
                style={{ width: "50%", marginTop: "10px" }}
              />
            )}
          </Col>
          <Col lg={6} md={6} sm={12}>
            <Form.Group className="mb-3" controlId="formEventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                name="event_name"
                value={eventData.event_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter event description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={eventData.start_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={eventData.end_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="update-button">
              Update Event
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UpdateEvent;
