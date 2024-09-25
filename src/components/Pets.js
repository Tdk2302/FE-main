import React, { useState } from 'react';
import ShibaImage from '../assets/images/Shiba.jpg';  // Path to your image
import "../styles/pet.scss";
const Pets = () => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [spayed, setSpayed] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [rabiesvaccinated, setRabiesvaccinated] = useState(false);
  const [toiletTrained, setToiletTrained] = useState(false);
  const [friendly, setFriendly] = useState(false);
  const [diet, setDiet] = useState('');

  const handleUpdate = () => {
    const updatedData = {
      name, breed, age, weight, gender, spayed, vaccinated, toiletTrained, rabiesvaccinated, friendly, diet,
    };
    console.log("Updated User Info:", updatedData);
  };

  return (
    <div className="container pets-container">
      <div className="row">
        {/* Left Side with Image */}
        <div className="col-lg-6 col-md-6 col-sm-12 text-center">
          <img src={ShibaImage} alt="Shiba" className="img-fluid mb-3 photo" />
          <button className="pet-btn w-100 mb-3 upload">Upload</button>
        </div>

        {/* Right Side with Form */}
        <div className="col-lg-6 col-md-6 col-sm-12 text-center">
          {/* Name Input */}
          <div className="row mb-3">
            <div className="col-sm-8 mx-auto">
              <input type="text" placeholder="Name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          {/* Breed Input */}
          <div className="row mb-3">
            <div className="col-sm-8 mx-auto">
              <input type="text" placeholder="Breed" className="form-control" value={breed} onChange={(e) => setBreed(e.target.value)} />
            </div>
          </div>

          {/* Age Input */}
          <div className="row mb-3">
            <div className="col-sm-8 mx-auto">
              <input type="number" placeholder="Age" className="form-control" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
          </div>

          {/* Weight Input */}
          <div className="row mb-3">
            <div className="col-sm-8 mx-auto">
              <input type="number" placeholder="Weight" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>

          {/* Gender Select */}
          <div className="row mb-3">
            <div className="col-sm-8 mx-auto">
              <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="" disabled hidden>Choose Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Diet Input */}
          <div className="row mb-3">
            <div className="col-sm-8 mx-auto">
              <input type="text" placeholder="Diet" className="form-control" value={diet} onChange={(e) => setDiet(e.target.value)} />
            </div>
          </div>

          {/* Checkboxes for Attributes */}
          <div className="row">
            <div className="col-md-6">
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={spayed} onChange={(e) => setSpayed(e.target.checked)} />
                <label className="form-check-label">Spayed</label>
              </div>

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={toiletTrained} onChange={(e) => setToiletTrained(e.target.checked)} />
                <label className="form-check-label">Toilet Trained</label>
              </div>

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={rabiesvaccinated} onChange={(e) => setRabiesvaccinated(e.target.checked)} />
                <label className="form-check-label">Rabies Vaccinated</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={vaccinated} onChange={(e) => setVaccinated(e.target.checked)} />
                <label className="form-check-label">Vaccinated</label>
              </div>

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={friendly} onChange={(e) => setFriendly(e.target.checked)} />
                <label className="form-check-label">Friendly</label>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <button className="pet-btn w-50" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default Pets;
