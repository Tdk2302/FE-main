import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import "../styles/adminpage.scss"; // Thêm import cho style

const HistoryAdoption = () => {
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const accountID = localStorage.getItem("accountID");

  useEffect(() => {
    const fetchAdoptedPets = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/pets/historyAdopt/${accountID}`);
        setAdoptedPets(response.data.data);
      } catch (error) {
        toast.error("Error fetching adopted pets");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdoptedPets();
  }, [accountID]);

  const handleReportVideo = (pet) => {
    if (pet.petID) {
      navigate(`/report/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="admin-notifications">
      <div className="notifications-content">
        <h1>Adopted Pets History</h1>
        {adoptedPets.length === 0 ? (
          <p>No pets found in adoption history.</p>
        ) : (
          <ul className="notification-list">
            {adoptedPets.map((pet) => (
              <li key={pet.petID} className="notification-item">
                <div className="pet-info-history">
                  <h2>{pet.name}</h2>
                  <p>Breed: {pet.breed}</p>
                  <p>Age: {pet.age} months</p>
                </div>
                <button
                  className="report-button"
                  onClick={() => handleReportVideo(pet)}
                >
                  Report
                </button>{" "}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryAdoption;
