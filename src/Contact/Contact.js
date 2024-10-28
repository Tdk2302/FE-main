import React from "react";
import "../styles/Contact.scss";

import { Container, Row, Col } from "react-bootstrap";
import toyimg from "../assets/images/pet-toy.png";
import clothesimg from "../assets/images/pet-clothes.png";
import foodimg from "../assets/images/dog-food.png";
import OtherSupportMethods from "../components/OtherSupportMethods";

const Contact = (props) => {
  return (
    <Container className="contact-container">
      <h1>Contact Information</h1>
      <Row>
        <Col md={6}>
          <div className="contact-info">
            <p>
              <i class="fa-solid fa-envelope" style={{ color: "#b92d2d" }}></i>{" "}
              Email: furryfriendfund@gmail.com
            </p>
            <p>
              <i class="fa-solid fa-phone" style={{ color: "#b82828" }}></i>{" "}
              Phone: (+84)39 320 1068
            </p>
            <p>
              <i
                class="fa-solid fa-location-dot"
                style={{ color: "#c93131" }}
              ></i>{" "}
              Address: TP Ho Chi Minh - Vietnam
            </p>
          </div>
          <h1>Donation Accounts</h1>
          <p>
            The cost will be divided equally among the other children still in
            hospital and to build a common house.
          </p>
          <div className="account-info">
            <i
              class="fa-solid fa-building-columns"
              style={{ color: "#d71d1d" }}
            ></i>
            {"  "}
            <strong>ACB:</strong>
            <p> Trương Phúc Lộc - 0011004054939</p>

            <i
              class="fa-solid fa-building-columns"
              style={{ color: "#d71d1d" }}
            ></i>
            {"  "}
            <strong>BIDV: </strong>
            <p>Huỳnh Gia Bảo - 12610000951797</p>

            <i
              class="fa-solid fa-building-columns"
              style={{ color: "#d71d1d" }}
            ></i>
            {"  "}
            <strong>Military Bank:</strong>
            <p> Tăng Đình Khôi - 9990305363979</p>
          </div>
        </Col>

        <div className="additional-info">
          <h2>Need More Information or Have Feedback?</h2>
          <p>
            If you need additional information or would like to provide
            feedback, please{" "}
            <a href="/feedback" className="feedback-link">
              click here
            </a>
            . We greatly appreciate your input as it helps us improve and serve
            you better.
          </p>
        </div>
      </Row>

      <OtherSupportMethods />
    </Container>
  );
};

export default Contact;
