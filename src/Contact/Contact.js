import React from "react";
import "../styles/Contact.scss"; // Ensure you have created the corresponding CSS file
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDonate,
  FaComments,
} from "react-icons/fa"; // Import icons
import { Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components

const Contact = (props) => {
  return (
    <Container className="contact-container">
      <h1>
        <FaComments /> Contact Information
      </h1>
      <Row>
        <Col md={6}>
          <div className="contact-info">
            <p>
              <FaEnvelope /> Email: furryfriendfund@gmail.com
            </p>
            <p>
              <FaPhone /> Phone: (+84)39 320 1068
            </p>
            <p>
              <FaMapMarkerAlt /> Address: Hanoi - Vietnam
            </p>
          </div>
          <h2>
            <FaDonate /> Donation Accounts
          </h2>
          <div className="account-info">
            <p>ACB: Trương Phúc Lộc - 0011004054939</p>
            <p>BIDV: Huỳnh Gia Bảo - 12610000951797</p>
            <p>Military Bank: Tăng Đình Khôi - 9990305363979</p>
            <p>Paypal: furryfriendfund@gmail.com</p>
          </div>
        </Col>
        <Col md={6}>
          <h2>
            <FaComments /> Send Feedback
          </h2>
          <form className="feedback-form">
            <input type="text" placeholder="Full Name *" required />
            <input type="email" placeholder="Email *" required />
            <input type="text" placeholder="Subject *" required />
            <textarea placeholder="Content *" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
