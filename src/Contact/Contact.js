import React from "react";
import "../styles/Contact.scss";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDonate,
  FaComments,
} from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import toyimg from "../assets/images/pet-toy.png";
import clothesimg from "../assets/images/pet-clothes.png";
import foodimg from "../assets/images/dog-food.png";

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
        <Col md={6}>
          <h1>Send Feedback</h1>
          <form className="feedback-form">
            <input type="text" placeholder="Full Name *" required />
            <input type="email" placeholder="Email *" required />
            <input type="text" placeholder="Subject *" required />
            <textarea placeholder="Content *" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </Col>
      </Row>
      <div className="banner-donate">
        <section class="container-fluid pattern1 bg-light">
          <h2 data-aos="fade-up" className="title-banner">
            Other support methods
          </h2>

          <div class="container mt-4">
            <div class="row justify-content-center other-method-of-support">
              <div
                class="col-4 col-sm-4 col-md-3 col-lg-3 aos-init aos-animate"
                data-aos="zoom-in"
              >
                <div class="serviceBox2">
                  <div class="service-icon">
                    <img
                      class="img-fluid img-lazy-load"
                      src={toyimg}
                      alt="Toys"
                    />
                  </div>
                  <div className="service-content">
                    <h5 className="text-capitalize">Toys</h5>
                  </div>
                </div>
              </div>
              <div
                class="col-4 col-sm-4 col-md-3 col-lg-3 aos-init aos-animate"
                data-aos="zoom-in"
              >
                <div class="serviceBox2">
                  <div class="service-icon">
                    <img
                      data-src=""
                      class="img-fluid img-lazy-load"
                      alt="Quần áo"
                      src={clothesimg}
                    />
                  </div>
                  <div class="service-content">
                    <h5 class="text-capitalize">Clothes</h5>
                  </div>
                </div>
              </div>
              <div
                class="col-4 col-sm-4 col-md-3 col-lg-3 aos-init aos-animate"
                data-aos="zoom-in"
              >
                <div class="serviceBox2">
                  <div class="service-icon">
                    <img
                      data-src=""
                      class="img-fluid img-lazy-load"
                      alt="Thức ăn"
                      src={foodimg}
                    />
                  </div>
                  <div class="service-content">
                    <h5 class="text-capitalize">Food</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
};

export default Contact;
