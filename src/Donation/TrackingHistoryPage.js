// src/pages/TrackingHistoryPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TrackingHistoryDonation.scss"; // Import the new SCSS file
import { BASE_URL } from "../services/axios";

const TrackingHistoryPage = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accountID = localStorage.getItem("accountID");

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}donation/searchDonationsByAccountID?ID=${accountID}`
        );
        setDonationHistory(response.data.data);
        response.data.data.sort(
          (a, b) => new Date(b.date_time) - new Date(a.date_time)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [accountID]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("vi-VN", options).format(
      new Date(dateString)
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="tracking-history">
      <h2>Donation History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Amount (VNĐ)</th>
          </tr>
        </thead>
        <tbody>
          {donationHistory.map((donation) => (
            <tr key={donation.id}>
              <td>{formatDate(donation.date_time)}</td>
              <td>{donation.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingHistoryPage;
