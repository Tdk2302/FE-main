import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../services/axios";
import Spinner from "../components/Spinner";
import "../styles/adminpage.scss";
import ReasonModal from "../components/ReasonModal";
import { toast } from "react-toastify";
import PetStatus from "../components/PetStatus";

const HistoryAdoption = () => {
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const navigate = useNavigate();
  const accountID = localStorage.getItem("accountID");

  const getImageUrl = useCallback((img_url) => {
    if (img_url.startsWith("http")) return img_url;
    // Chỉnh sửa ở đây để tạo URL đúng định dạng
    return `http://localhost:8081/${img_url.replace(/\\/g, "/")}`;
  }, []);

  useEffect(() => {
    const fetchAdoptedPets = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/pets/historyAdopt/${accountID}`);
        setAdoptedPets(response.data.data);
        console.log(response.data.data);
        setImagePreview(getImageUrl(response.data.data.img_url));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdoptedPets();
  }, [accountID]);

  const handleReportVideo = (pet, event) => {
    event.preventDefault();
    if (pet.petID) {
      navigate(`/report/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };

  const handleViewDetail = (pet) => {
    navigate(`/petdetail/${pet.petID}`, { state: { pet } });
  };

  const handleViewReportHistory = (pet, event) => {
    event.preventDefault();
    if (pet.petID) {
      navigate(`/reportdetail/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };

  const handleReturnPet = (pet) => {
    setSelectedPet(pet);
    setIsReasonModalOpen(true);
  };

  const handleReasonSubmit = async (reason) => {
    // Kiểm tra selectedPet
    if (!selectedPet || !selectedPet.petID) {
      toast.error("Invalid pet selection");
      console.error("Selected pet data:", selectedPet);
      return;
    }

    // Kiểm tra reason
    if (!reason || reason.trim() === "") {
      toast.error("Please provide a valid reason");
      return;
    }

    // Log để debug
    console.log("Submitting return request with:", {
      petID: selectedPet.petID,
      reason: reason,
      selectedPet: selectedPet,
    });

    try {
      const response = await api.put(`/pets/returnPets/${selectedPet.petID}`, {
        reason: reason,
      });
      toast.success(response.data.message);
      console.log("Refreshing pet list...");
      const updatedResponse = await api.get(`/pets/historyAdopt/${accountID}`);
      console.log("Updated pets list:", updatedResponse.data);
      setAdoptedPets(updatedResponse.data.data);
    } catch (error) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        error: error,
      });
      toast.error("Error returning pet");
    }
    setIsReasonModalOpen(false);
    setSelectedPet(null);
  };

  const handleCancelRequest = async (pet) => {
    try {
      // Assuming you have an API endpoint for canceling the return request
      await api.put(`/cancelReturnRequest/${pet.petID}`);
      // Refresh the pet list after successful cancellation
      const response = await api.get(`/pets/historyAdopt/${accountID}`);
      setAdoptedPets(response.data.data);
    } catch (error) {
      console.error("Error canceling return request:", error);
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
                <div
                  className="pet-image-history"
                  onClick={() => handleViewDetail(pet)}
                >
                  <img
                    src={getImageUrl(pet.img_url)}
                    alt={pet.name}
                    className="img-preview"
                    style={{ width: "50%", height: "50%" }}
                  />
                </div>
                <div
                  className="pet-info-history"
                  onClick={() => handleViewDetail(pet)}
                >
                  <h2>{pet.name}</h2>
                  <p>
                    <PetStatus status={pet.status} />
                  </p>
                  <p>Breed: {pet.breed}</p>
                  <p>Age: {pet.age} months</p>
                  <p>Weight: {pet.weight} kg</p>
                </div>
                <div className="button-report">
                  {pet.status !== "Trusted" && (
                    <>
                      <button
                        className="report-button"
                        onClick={(event) => handleReportVideo(pet, event)}
                      >
                        Report
                      </button>
                      <button
                        className="report-button"
                        onClick={(event) => handleViewReportHistory(pet, event)}
                      >
                        View History Report
                      </button>
                      {pet.status === "Processing" ? (
                        <button
                          className="return-button"
                          onClick={() => handleCancelRequest(pet)}
                        >
                          Cancel Return Request
                        </button>
                      ) : (
                        <button
                          className="return-button"
                          onClick={() => handleReturnPet(pet)}
                        >
                          Return Pet
                        </button>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <ReasonModal
          open={isReasonModalOpen}
          onClose={() => setIsReasonModalOpen(false)}
          onSubmit={handleReasonSubmit}
          title="Return Pet Request"
          submitText="Submit Request"
          placeholder="Please provide a reason for returning the pet..."
        />
      </div>
    </div>
  );
};

export default HistoryAdoption;
