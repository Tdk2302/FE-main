import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

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
    <div>
      <h1>Adopted Pets History</h1>
      {adoptedPets.length === 0 ? (
        <p>No pets found in adoption history.</p>
      ) : (
        adoptedPets.map((pet) => (
          <div key={pet.petID}>
            <h2>{pet.name}</h2>
            <p>Breed: {pet.breed}</p>
            <p>Age: {pet.age} months</p>
            <button onClick={() => handleReportVideo(pet)}>Report Video</button>
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryAdoption;
