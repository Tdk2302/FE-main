import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import "../styles/footer.scss";

const Footer = () => {
  return (
    <div className="footer bottom">
      <div className="footer-container">
        <div className="footer-info">
          <h2>FurryFriendsFund</h2>
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
          <h4>Về chúng tôi</h4>
          <hr className="small-divider left"></hr>
          <p>
            Nhóm trẻ tình nguyện viên Việt Nam và quốc tế, hoạt động vì tình yêu
            chó mèo.
          </p>
        </div>

        <div className="footer-bottom">
          <h4>Thông tin liên hệ</h4>
          <hr className="small-divider"></hr>
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
