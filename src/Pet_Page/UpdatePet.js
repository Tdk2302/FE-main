import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../services/axios";
import { toast } from "react-toastify";
import "../styles/addpet.scss";

const UpdatePet = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu thú cưng từ state (nếu có)
  const initialPetData = location.state?.pet || {
    name: "",
    breed: "",
    sex: "",
    age: "",
    weight: "",
    note: "",
    size: "",
    potty_trained: false,
    dietary_requirements: false,
    spayed: false,
    vaccinated: false,
    socialized: false,
    rabies_vaccinated: false,
    origin: "",
    img_url: "",
    categoryID: "",
    description: "",
  };

  const [petData, setPetData] = useState(initialPetData);
  const [imagePreview, setImagePreview] = useState(initialPetData.img_url); // Hiển thị ảnh từ dữ liệu ban đầu

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setPetData((prev) => ({
      ...prev,
      categoryID: value ? parseInt(value, 10) : 0,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPetData((prev) => ({
      ...prev,
      img_url: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Thêm tất cả các trường dữ liệu vào FormData
    Object.keys(petData).forEach((key) => {
      if (key === "img_url" && petData[key] instanceof File) {
        formData.append("img_url", petData[key]);
      } else if (typeof petData[key] === "boolean") {
        formData.append(key, petData[key].toString());
      } else {
        formData.append(key, petData[key]);
      }
    });

    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(`/pets/${petData.petID}/updatePets`, {
        formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response from server:", response.data);
      toast.success(response.data.message);
      navigate("/petlistadmin");
    } catch (error) {
      console.error(
        "Error updating pet:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to update pet. Please try again.");
    }
  };

  return (
    <div className="container pets-container">
      <h1 className="add-pet__title">UPDATE PET</h1>
      <form className="add-pet__form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 text-center">
            <input
              type="file"
              name="img_url"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Pet Preview"
                className="img-preview"
                style={{ width: "50%", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 text-center">
            <input
              type="text"
              placeholder="Pet Name"
              className="form-control"
              name="name"
              value={petData.name}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Pet Breed"
              className="form-control"
              name="breed"
              value={petData.breed}
              onChange={handleChange}
            />
            <select
              className="form-select male"
              name="sex"
              value={petData.sex}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="number"
              step="0.5"
              placeholder="Pet Age"
              className="form-control"
              name="age"
              value={petData.age}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Pet Weight"
              className="form-control"
              name="weight"
              value={petData.weight}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Note"
              className="form-control"
              name="note"
              value={petData.note}
              onChange={handleChange}
            />
            <select
              type="text"
              placeholder="Size"
              className="form-control"
              name="size"
              value={petData.size}
              onChange={handleChange}
            >
              <option value="">Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <select
              className="form-select"
              name="categoryID"
              value={petData.categoryID}
              onChange={handleCategoryChange}
            >
              <option value="">Category</option>
              <option value="1">Dog</option>
              <option value="2">Cat</option>
            </select>
            <input
              type="text"
              placeholder="Origin"
              className="form-control"
              name="origin"
              value={petData.origin}
              onChange={handleChange}
            />
            <textarea
              placeholder="Description"
              className="form-control"
              name="description"
              value={petData.description}
              onChange={handleChange}
            />
            {/*Checkboxes*/}
            <div className="col-md-3">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="potty_trained"
                  checked={petData.potty_trained}
                  onChange={handleChange}
                />
                <label className="form-check-label">Potty Trained</label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="spayed"
                  checked={petData.spayed}
                  onChange={handleChange}
                />
                <label className="form-check-label">Spayed</label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="vaccinated"
                  checked={petData.vaccinated}
                  onChange={handleChange}
                />
                <label className="form-check-label">Vaccinated</label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="socialized"
                  checked={petData.socialized}
                  onChange={handleChange}
                />
                <label className="form-check-label">Socialized</label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="rabies_vaccinated"
                  checked={petData.rabies_vaccinated}
                  onChange={handleChange}
                />
                <label className="form-check-label">Rabies Vaccinated</label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="dietary_requirements"
                  checked={petData.dietary_requirements}
                  onChange={handleChange}
                />
                <label className="form-check-label">Dietary Requirements</label>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="create-button w-50"
              type="submit"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdatePet;
