import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const ReportDetail = () => {
  const location = useLocation();
  const petID = location.state?.petID;
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/reports/${petID}`);
        setReports(response.data.data);
      } catch (error) {
        toast.error("Error fetching report history");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [petID]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>Report History for Pet ID: {petID}</h1>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id}>
              <video controls>
                <source src={report.videoUrl} type="video/webm" />
                Your browser does not support the video tag.
              </video>
              <p>{report.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportDetail;
