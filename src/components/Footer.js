import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import "../styles/footer.scss";

const Footer = () => {
  return (
    <div className="footer bottom">
      <div className="footer-container">
        <div className="footer-info">
          <h3>FurryFriendsFund</h3>
          <div className="social-icons">
            <a href="...">
              <FaFacebookF />
            </a>
            <a href="...">
              <FaYoutube />
            </a>
            <a href="...">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-about">
          <h4>About us</h4>
          <hr className="small-dividers left"></hr>
          <p>
            FurryFriendsFund is a small pet shelter where we strive to provide
            the best living environment for our pets.
          </p>
        </div>

        <div className="footer-bottom">
          <h4>Contact us</h4>
          <hr className="small-dividers"></hr>
          <p>
            <i className="fa fa-phone"></i> (+84)000000000
            <br />
            <i className="fa fa-envelope"></i> furryfriendFund@gmail.com
            <br />
            <i className="fa fa-map-marker"></i> Ho Chi Minh - Viet Nam
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
