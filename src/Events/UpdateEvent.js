import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../services/axios";
import "../styles/updateevent.scss";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const UpdateEvent = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState({
    event_name: "",
    description: "",
    start_date: "",
    end_date: "",
    img_url: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return null; // Hoặc return một đường dẫn đến hình ảnh mặc định
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  };

  useEffect(() => {
    if (!eventID) {
      toast.error("ID sự kiện không hợp lệ");
      navigate("/events");
      return;
    }

    const fetchEventData = async () => {
      try {
        console.log("Fetching event data for ID:", eventID);
        const response = await api.get(`/events/${eventID}/getEventById`, {
          params: { eventId: eventID }
        });
        console.log("API response:", response.data);
        if (response.data.status === 200) {
          setEventData(response.data.data);
          setImagePreview(getImageUrl(response.data.data.img_url));
        } else {
          throw new Error(response.data.message || "Không thể tải dữ liệu sự kiện");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sự kiện:", error);
        toast.error(error.message || "Không thể tải dữ liệu sự kiện");
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [eventID, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File được chọn:", file.name, "Kích thước:", file.size, "bytes");
      setEventData((prev) => ({
        ...prev,
        img_url: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Đã đọc file, độ dài dữ liệu:", reader.result.length);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Không có file nào được chọn");
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    for (const key in eventData) {
      formData.append(key, eventData[key]);
      console.log(`Đang thêm ${key} vào FormData:`, eventData[key]);
    }

    try {
      console.log("Đang gửi yêu cầu cập nhật sự kiện...");
      const response = await api.post(`/events/${eventID}/updateEvents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Toàn bộ response từ server:", response);
      if (response.data.status === 200) {
        console.log("Cập nhật thành công, dữ liệu trả về:", response.data);
        if (response.data.data && response.data.data.img_url) {
          console.log("URL hình ảnh mới:", response.data.data.img_url);
        }
        toast.success(response.data.message || "Sự kiện đã được cập nhật thành công");
        navigate("/events", { state: { updated: true } });
      } else {
        throw new Error(response.data.message || "Không thể cập nhật sự kiện");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      console.error("Chi tiết lỗi:", error.response?.data);
      toast.error(error.response?.data?.message || error.message || "Không thể cập nhật sự kiện");
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
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Event Preview"
                className="img-preview"
                style={{ width: "50%", marginTop: "10px" }}
              />
            ) : eventData.img_url ? (
              <img
                src={getImageUrl(eventData.img_url)}
                alt="Current Event Image"
                className="img-preview"
                style={{ width: "50%", marginTop: "10px" }}
              />
            ) : null}
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
