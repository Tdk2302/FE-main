// src/Pet_Page/UpdatePet.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/axios";
import "../styles/addpet.scss";

const UpdatePet = ({ onPetUpdated }) => {
  const navigate = useNavigate();
  const { petId } = useParams(); // Lấy ID thú cưng từ URL

  const [petData, setPetData] = useState({
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
    img_url: null,
    categoryID: null,
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const roleID = localStorage.getItem("roleID");

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await axios.get(`pets/${petId}`);
        setPetData(response.data);
        setImagePreview(response.data.img_url); // Giả sử img_url là URL của hình ảnh
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    fetchPetData();
  }, [petId]);

  if (roleID === "3") {
    return <h1>Access Denied</h1>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    for (const key in petData) {
      formData.append(key, petData[key]);
    }

    try {
      await axios.put(`pets/updatePets/${petId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Pet updated successfully!");
      onPetUpdated();
      navigate("/petlist");
    } catch (error) {
      console.error(
        "Error updating pet:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to update pet. Please try again.");
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
              required
            />
            <input
              type="text"
              placeholder="Pet Breed"
              className="form-control"
              name="breed"
              value={petData.breed}
              onChange={handleChange}
              required
            />
            <select
              className="form-select male"
              name="sex"
              value={petData.sex}
              onChange={handleChange}
              required
            >
              <option value="">Gender</option>
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
              required
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
              onChange={handleChange}
              required
            >
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
              required
            />
            {/*Checkbox */}
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
            </div>
            <button className="create-button w-50" type="submit">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdatePet;
