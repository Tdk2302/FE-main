import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../styles/homepage.scss";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import dog1 from "../assets/images/dog-1.jpg";
import dog2 from "../assets/images/dog-2.jpg";
import dog3 from "../assets/images/dog-3.jpg";
import dog4 from "../assets/images/dog-4.jpg";
import aboutUsImage from "../assets/images/logo.webp"; // Đảm bảo bạn có hình ảnh này

const HomePage = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const newsItems = [
    {
      id: 1,
      image: dog2,
      title: "Chú Chó Shiba Inu Nổi Tiếng Khắp Thế Giới...",
      description: "Trong hội bạn thân nào cũng có ai đó chuyên gia",
    },
    {
      id: 2,
      image: dog1,
      title: '"Chú Mèo Buồn Bã Nhất Thế Giới" Ngày Ấy...',
      description: "Cái kết hạnh phúc cho chú mèo chỉ sau 1 năm",
    },
    {
      id: 3,
      image: dog3,
      title: "Gặp Gỡ Chú Mèo Gây Bão Cộng Đồng Mạng...",
      description:
        "Gặp Gỡ Chú Mèo Gây Bão Cộng Đồng Mạng Với Cánh Tay Nghịch Ngợm Của Mình",
    },
    {
      id: 4,
      image: dog4,
      title: "Gặp Gỡ Chú Mèo Gây Bão Cộng Đồng Mạng...",
      description:
        "Gặp Gỡ Chú Mèo Gây Bão Cộng Đồng Mạng Với Cánh Tay Nghịch Ngợm Của Mình",
    },
  ];

  const nextNews = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex(
      (prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length
    );
  };
  const pets = [
    {
      name: "Win",
      image: dog1,
      gender: "Đực",
      age: "Trưởng thành",
      vaccinated: "Có",
    },
    {
      name: "Elvis",
      image: dog2,
      gender: "Đực",
      age: "Trưởng thành",
      vaccinated: "Chưa rõ",
    },
    {
      name: "Nicky",
      image: dog3,
      gender: "Đực",
      age: "Trưởng thành",
      vaccinated: "Có",
    },
    {
      name: "Orion",
      image: dog4,
      gender: "Cái",
      age: "Trưởng thành",
      vaccinated: "Có",
    },
  ];

  return (
    /**Banner */
    <div className="homepage">
      <section className="hero-section">
        <h2>FurryFriendsFund</h2>
        <p>Nhận nuôi thú cưng - Mang yêu thương về nhà</p>
      </section>

      <section className="about-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2>Nhận Nuôi Thú Cưng - Hanoi Pet Adoption</h2>
              <p>
                Chúng tôi là một nhóm trẻ gồm tình nguyện viên Việt Nam và một
                số bạn nước ngoài, cùng hoạt động vì tình yêu chó mèo. Tôn chỉ
                hoạt động của chúng tôi là không từ bỏ nỗ lực với bất kỳ con vật
                nào, dù bé có ốm yếu hay tàn tật tới đâu, bởi mọi thú cưng đều
                cần có cơ hội hi vọng vào một tương lai tốt đẹp. Chúng tôi cố
                gắng chăm sóc tốt nhất có thể, phần nào bù đắp lại những tổn
                thương cho các bé được cứu hộ về dù là hoang, lạc, bị bỏ rơi hay
                bạo hành. Ngoài ra, chúng tôi cũng luôn nỗ lực tìm mái ấm yêu
                thương các bé trọn đời. Và cuối cùng, chúng tôi giúp nâng cao
                nhận thức về trách nhiệm của chủ nuôi thông qua mạng xã hội và
                các hoạt động thiện nguyện.
              </p>

              <NavLink to="/contact" className="nav-link">
                <button className="about-us-button">ABOUT US</button>
              </NavLink>
            </div>
            <div className="col-md-4">
              <img
                src={aboutUsImage}
                alt="About Us"
                className="about-us-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách các bé */}
      <section className="featured-pets">
        <h2>Lists of pets</h2>
        <Carousel
          responsive={responsive}
          infinite={true}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {pets.map((pet, index) => (
            <div key={index} className="pet-card">
              <NavLink to="/adopt" className="nav-link">
                <img src={pet.image} alt={pet.name} />
                <h3>{pet.name}</h3>
                <p>Gender: {pet.gender}</p>
                <p>Age: {pet.age}</p>
                <p>Vaccinated: {pet.vaccinated}</p>
              </NavLink>
            </div>
          ))}
        </Carousel>
        <NavLink to="/adopt" className="nav-link">
          <button className="adopt-button">ADOPT</button>
        </NavLink>
      </section>

      {/* Tin tức */}
      <section className="news">
        <h2>News</h2>
        <div className="news-slider">
          <button onClick={prevNews} className="slider-button left">
            <FaChevronLeft />
          </button>
          <div className="news-items">
            {newsItems.map((item, index) => (
              <div
                key={item.id}
                className={`news-item ${
                  index === currentNewsIndex ? "active" : ""
                }`}
              >
                <img src={item.image} alt={item.title} />
                <div className="news-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={nextNews} className="slider-button right">
            <FaChevronRight />
          </button>
        </div>
        <button className="read-more">READ MORE</button>
      </section>

      <div class="support-banner">
        <div class="container">
          <div class="row align-items-center">
            <div class="col">
              <h2 class="support-text">Bạn Đã Sẵn Sàng Giúp Đỡ?</h2>
            </div>
            <div class="col-auto">
              <NavLink to="/donate" className="nav-link">
                <button class="support-button">DONATE NOW</button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
