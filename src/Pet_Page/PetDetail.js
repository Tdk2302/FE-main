import React from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate, NavLink } from "react-router-dom"; // Thêm useParams
import { BASE_URL } from "../services/axios";
import "../styles/petdetail.scss";
const PetDetail = () => {
  // Giả sử bạn có một hàm để lấy thông tin thú cưng theo petID
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location
  const pet = location.state?.pet;
  console.log("Pet data:", pet); // Kiểm tra dữ liệu
  const roleID = localStorage.getItem("roleID");
  const handleAdopt = (pet) => {
    if (pet.petID) {
      navigate(`/adoptprocess/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };

  const handleUpdatePet = () => {
    if (pet.petID) {
      navigate(`/petupdate/${pet.petID}`); // Chuyển hướng đến trang cập nhật
    } else {
      console.error("Pet ID is undefined");
    }
  };

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("images\\"))
      return `${BASE_URL}${imgUrl.replace("\\", "/")}`;
    return imgUrl;
  };

  if (!pet) {
    return <div>Pet not found</div>; // Xử lý trường hợp không có pet
  }

  return (
    <div className="petdetail-container">
      <div className="row">
        <div className="pet-img">
          <div class="col-sm-5 col-md-5 col-lg-5 float-left avatar-animal">
            <img src={getImageUrl(pet.img_url)} alt={pet.name} />
          </div>
        </div>
        <div class="col-sm-6 col-md-6 col-lg-6 caption-adoption float-right">
          <div className="pet-info">
            <h1>{pet.name}</h1> {/* Hiển thị tên thú cưng */}
            <p>
              <strong>Breed:</strong> {pet.breed}
            </p>
            <p>
              <strong>Age:</strong> {pet.age}
            </p>
            <p>
              <strong>Sex:</strong> {pet.sex}
            </p>
            <p>
              <strong>Size:</strong> {pet.size}
            </p>
            <p>
              <strong>Weight:</strong> {pet.weight}kg
            </p>
            <p>
              <strong>Vaccinated:</strong> {pet.vaccinated ? "✓" : ""}
            </p>
            <p>
              <strong>Spayed:</strong> {pet.spayed ? "✓" : ""}
            </p>
            <p>
              <strong>Potty Trained:</strong> {pet.potty_trained ? "✓" : ""}
            </p>
            <p>
              <strong>Dietary Requirements:</strong>{" "}
              {pet.dietary_requirements ? "✓" : ""}
            </p>
            <p>
              <strong>Friendly:</strong> {pet.socialized ? "✓" : ""}
            </p>
            <p>
              <strong>Rabies Vaccinated:</strong>{" "}
              {pet.rabies_vaccinated ? "✓" : ""}
            </p>
            {roleID === "3" && (
              <div className="adopt-button">
                <Button onClick={() => handleAdopt(pet)}>Adopt</Button>
              </div>
            )}
          </div>
          {roleID === "2" && (
            <div class="edit-button">
              <Button onClick={handleUpdatePet}>Edit Pet</Button>
            </div>
          )}
        </div>
      </div>
      {roleID === "3" && (
        <div className="support-banner">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="support-text">Have you already supported us?</h2>
              </div>
              <div className="col-auto">
                <NavLink to="/donate" className="nav-link">
                  <button className="support-button">DONATE NOW</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetail;
