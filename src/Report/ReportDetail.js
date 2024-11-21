import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import "../styles/ReportDetail.scss";
const ReportDetail = () => {
  const location = useLocation();
  const [pet, setPet] = useState(location.state?.pet);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const roleID = localStorage.getItem("roleID");

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/report/getPetReports/${pet.petID}`);
        setReports(response.data.data);
        setVideo(response.data.data[0]?.video);
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [pet.petID]);

  const getImageUrl = useCallback((img_url) => {
    if (img_url.startsWith("http")) return img_url;
    return `http://localhost:8081/${img_url.replace(/\\/g, "/")}`;
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const videoSrc = video ? `data:video/webm;base64,${video}` : null;

  const groupedReports = reports.reduce((acc, report) => {
    const month = new Date(report.date_report).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(report);
    return acc;
  }, {});

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleRemind = async () => {
    try {
      const response = await api.post(`notification/remindReport`, {
        petID: pet.petID,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const getFormattedDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="report-detail-container" style={{ display: "flex" }}>
      <div className="pet-info" style={{ flex: 5, padding: "20px" }}>
        <h2>Pet Information</h2>
        <div className="pet-info-report">
          <div className="pet-image-report">
            <img
              src={getImageUrl(pet.img_url)}
              alt={pet.name}
              className="img-report"
            />
          </div>
          <div className="pet-details">
            <p>
              <strong>Name: </strong> {pet.name}
            </p>
            <p>
              <strong>Breed: </strong> {pet.breed}
            </p>
            <p>
              <strong>Age: </strong> {pet.age} month
            </p>
            <p>
              <strong>Sex: </strong> {pet.sex}
            </p>
            <p>
              <strong>Weight: </strong> {pet.weight}kg
            </p>
            <p>
              {" "}
              <strong>Adopt date: </strong> {getFormattedDate(pet.adopt_date)}
            </p>
          </div>
        </div>
        {roleID === "2" && (
          <div className="remind-button">
            <Button className="remind-button1" onClick={handleRemind}>
              Remind
            </Button>
          </div>
        )}
      </div>
      <div className="report-info" style={{ flex: 7, padding: "60px" }}>
        <select
          className="month-dropdown"
          onChange={handleMonthChange}
          value={selectedMonth}
        >
          <option value="">Choose Month</option>
          {Object.keys(groupedReports).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        {selectedMonth &&
          groupedReports[selectedMonth].map((report) => (
            <div key={report.id} className="report-item">
              <h4 className="report-date">
                Date of report: {formatDate(report.date_report)}
              </h4>
              <video
                className="report-video"
                src={`data:video/webm;base64,${report.video}`}
                controls
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReportDetail;
