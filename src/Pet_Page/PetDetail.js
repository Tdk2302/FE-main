import React from "react";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"; // Thêm useParams
import { BASE_URL } from "../services/axios";
import "../styles/petdetail.scss";
const PetDetail = () => {
  // Giả sử bạn có một hàm để lấy thông tin thú cưng theo petID
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location
  const pet = location.state?.pet;
  console.log("Pet data:", pet); // Kiểm tra dữ liệu

  const handleAdopt = (pet) => {
    if (pet.petID) {
      navigate(`/adoptprocess/${pet.petID}`, { state: { pet } });
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
        <div class="col-sm-7 col-md-7 col-lg-7 caption-adoption float-right">
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
              <strong>Vaccinated:</strong> {pet.spayed}
            </p>
            <div className="adopt-button">
              <Button onClick={() => handleAdopt(pet)}>Adopt</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
