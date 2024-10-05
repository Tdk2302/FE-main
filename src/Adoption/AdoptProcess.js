// src/components/AdoptionProcess.js
import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../styles/adoptprocess.scss";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../services/axios";

const AdoptionProcess = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location
  const pet = location.state?.pet;
  const petID = pet.petID;
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
  }); // Lưu thông tin đặt lịch hẹn

  const date_time = `${appointment.date}T${appointment.time}`; // Định dạng ISO 8601
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [showThankYou, setShowThankYou] = useState(false); // Trạng thái hiển thị bảng cảm ơn
  const accountID = localStorage.getItem("accountID"); // Lấy accountID
  // Xử lý khi người dùng nhấn nút "Đặt lịch hẹn"
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`appointment/adopt`, {
        date_time,
        accountID,
        petID,
      });
      setErrorMessage(response.data.message);
      // Kiểm tra nếu thành công thì hiển thị bảng cảm ơn
      if (response.status === 200) {
        setShowModal(false);
        setShowThankYou(true);
      }
      if (date_time === null) {
        console.log("alo");
        alert("Vui long nhap date va time");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("Conflict error:", error.response.data);
      }
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert(ErrorMessage);
    }
  };

  console.log(ErrorMessage);
  useEffect(() => {
    const today = new Date();
    const min = new Date(today.setDate(today.getDate() + 4)) // Lấy ngày hiện tại cộng thêm 4 ngày
      .toISOString()
      .split("T")[0]; // Định dạng thành YYYY-MM-DD
    const max = new Date(today.setDate(today.getDate() + 11)) // Giới hạn tối đa thêm 8 ngày từ ngày hiện tại
      .toISOString()
      .split("T")[0]; // Định dạng thành YYYY-MM-DD
    setMinDate(min);
    setMaxDate(max);
  }, []);
  // Xử lý khi người dùng tick vào ô "Đồng ý với chính sách"
  const handleAgreeChange = (event) => {
    setAgreed(event.target.checked);
  };

  // Xử lý khi người dùng bấm nút "Xác nhận"
  const handleConfirmClick = () => {
    if (agreed) {
      setShowModal(true);
    } else {
      alert("Vui lòng đồng ý với chính sách trước khi tiếp tục.");
    }
  };
  useEffect(() => {
    console.log("showModal has changed:", showModal);
  }, [showModal]); // Theo dõi sự thay đổi của showModal

  const handleAppointmentChange = (event) => {
    const { name, value } = event.target;
    if (name === "time") {
      const selectedTime = new Date(`1970-01-01T${value}:00`);
      const startTime = new Date(`1970-01-01T08:00:00`);
      const endTime = new Date(`1970-01-01T17:00:00`);
      if (selectedTime < startTime || selectedTime > endTime) {
        alert("Vui lòng chọn thời gian từ 8:00 đến 17:00.");
        return; // Ngăn không cho cập nhật nếu thời gian không hợp lệ
      }
    }
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm đóng modal
  const handleClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="adoption-process-container">
      {/*Quy trình nhận nuôi */}
      <div className="adoption-process-content">
        <h1 className="adoption-title">Adoption Process</h1>
        <p className="adoption-intro">
          Before deciding to adopt a dog or cat, please ask yourself if you are
          ready to take full responsibility for them, including financial,
          accommodation, and emotional commitment. Adoption requires a strong
          agreement from yourself, your family, and those involved. Please
          consider carefully before contacting HPA for adoption.
        </p>
        <h3>Ready to go? Follow these steps:</h3>
        <ul className="adoption-steps-list">
          <li>
            <span role="img" aria-label="step1">
              1️⃣
            </span>
            Learn about the pet you want to adopt on HPA's website.
          </li>
          <li>
            <span role="img" aria-label="step2">
              2️⃣
            </span>
            Contact the volunteer in charge of the pet to get more information.
          </li>
          <li>
            <span role="img" aria-label="step3">
              3️⃣
            </span>
            Join the adoption interview.
          </li>
          <li>
            <span role="img" aria-label="step4">
              4️⃣
            </span>
            Prepare the necessary facilities, sign the adoption papers, and pay
            the medical fee.
          </li>
          <li>
            <span role="img" aria-label="step5">
              5️⃣
            </span>{" "}
            Regularly update us on the pet’s situation, especially when there
            are any issues, to receive timely advice.
          </li>
        </ul>
        <div className="adoption-policy">
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={handleAgreeChange}
            />
            I agree to the <strong>adoption policies and regulations</strong>.
          </label>
        </div>
        <button className="confirm-button" onClick={handleConfirmClick}>
          Accept
        </button>
      </div>

      {/*Đặt lịch hẹn */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Schedule an Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Form.Group controlId="appointmentDate">
              <Form.Label className="label">Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                min={minDate} // Giới hạn ngày bắt đầu từ hôm nay
                max={maxDate} // Giới hạn ngày tối đa là 10 ngày sau
                value={appointment.date}
                onChange={handleAppointmentChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="appointmentTime" className="mt-3">
              <Form.Label className="label">Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={appointment.time}
                onChange={handleAppointmentChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="footer">
          <Button className="cancel-button" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="agree-button" onClick={handleSubmit}>
            Schedule Appointment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hiển thị bảng cảm ơn*/}
      <Modal show={showThankYou} onHide={() => setShowThankYou(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thank you!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="thank-body">
          Thank you for your interest in adopting a pet. We will contact you as
          soon as possible to complete the adoption procedure. If you have any
          questions, please feel free to contact us via email or hotline.
        </Modal.Body>
        <Modal.Footer className="thank-footer">
          <Button className="close-button" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdoptionProcess;
