// src/components/AddPet.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axios";
import "../styles/addpet.scss";

const AddPet = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState({
    name: "",
    type: "",
    age: "",
    description: "",
  });

  const roleID = localStorage.getItem("roleID"); // Lấy roleID từ localStorage

  // Kiểm tra roleID
  if (roleID !== "2") {
    return <h1>Access Denied</h1>; // Hiển thị thông báo nếu không phải roleID 2
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("pets/addPets", petData);
      alert("Pet added successfully!");
      navigate("/petlist"); // Chuyển hướng về danh sách thú cưng
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Failed to add pet. Please try again.");
    }
  };

  return (
    <div className="add-pet">
      <h1 className="add-pet__title">Add New Pet</h1>
      <form className="add-pet__form" onSubmit={handleSubmit}>
        <input
          className="add-pet__input"
          type="file"
          name="image"
          accept="image/*" // Chỉ chấp nhận hình ảnh
          onChange={handleChange} // Thêm hàm xử lý thay đổi
          required
        />
        <input
          className="add-pet__input"
          type="text"
          name="name"
          placeholder="Pet Name"
          value={petData.name}
          onChange={handleChange}
          required
        />
        <input
          className="add-pet__input"
          type="text"
          name="type"
          placeholder="Pet Type"
          value={petData.type}
          onChange={handleChange}
          required
        />
        <input
          className="add-pet__input"
          type="number"
          name="age"
          placeholder="Pet Age"
          value={petData.age}
          onChange={handleChange}
          required
        />
        <textarea
          className="add-pet__textarea"
          name="description"
          placeholder="Description"
          value={petData.description}
          onChange={handleChange}
          required
        />
        <button className="add-pet__button" type="submit">
          Add Pet
        </button>
      </form>
    </div>
  );
};

export default AddPet;
