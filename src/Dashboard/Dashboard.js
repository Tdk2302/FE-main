import React, { useState, useEffect, useCallback } from "react";
import axios from "../services/axios";
import "../styles/dashboard.scss";
import Spinner from "../components/Spinner";
import api from "../services/axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [isLoading, setIsLoading] = useState(false);
  const [accountStats, setAccountStats] = useState({});
  const [roleStats, setRoleStats] = useState({});
  const [petStats, setPetStats] = useState({});
  const [eventStats, setEventStats] = useState({});
  const [donationStats, setDonationStats] = useState({});

  // Fetch account statistics
  const fetchAccountStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getAccounts");
      setAccountStats(response.data.data);
    } catch (error) {
      console.error("Error fetching account stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch role statistics
  const fetchRoleStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getRoleAccounts");
      setRoleStats(response.data.data);
    } catch (error) {
      console.error("Error fetching role stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch pet statistics
  const fetchPetStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getPetTotal");
      setPetStats(response.data.data);
    } catch (error) {
      console.error("Error fetching pet stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch event statistics
  const fetchEventStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getEventTotal");
      setEventStats(response.data.data);
    } catch (error) {
      console.error("Error fetching event stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch donation statistics
  const fetchDonationStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getDonateTotal");
      setDonationStats(response.data.data);
    } catch (error) {
      console.error("Error fetching donation stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data based on active tab
  const refreshData = useCallback(() => {
    switch (activeTab) {
      case "accounts":
        fetchAccountStats();
        fetchRoleStats();
        break;
      case "pets":
        fetchPetStats();
        break;
      case "events":
        fetchEventStats();
        break;
      case "donations":
        fetchDonationStats();
        break;
      default:
        break;
    }
  }, [
    activeTab,
    fetchAccountStats,
    fetchRoleStats,
    fetchPetStats,
    fetchEventStats,
    fetchDonationStats,
  ]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="dashboard-container">
      <div className="sidebar-dashboard">
        <h2>Dashboard</h2>
        <ul>
          <li
            className={activeTab === "accounts" ? "active" : ""}
            onClick={() => setActiveTab("accounts")}
          >
            Accounts
          </li>
          <li
            className={activeTab === "pets" ? "active" : ""}
            onClick={() => setActiveTab("pets")}
          >
            Pets
          </li>
          <li
            className={activeTab === "events" ? "active" : ""}
            onClick={() => setActiveTab("events")}
          >
            Events
          </li>
          <li
            className={activeTab === "donations" ? "active" : ""}
            onClick={() => setActiveTab("donations")}
          >
            Donations
          </li>
        </ul>
      </div>

      <div className="main-content">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {activeTab === "accounts" && (
              <div className="stats-container">
                <div className="stats-section">
                  <h3>Account Status</h3>
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Available</td>
                        <td>{accountStats.available}</td>
                      </tr>
                      <tr>
                        <td>Banned</td>
                        <td>{accountStats.banned}</td>
                      </tr>
                      <tr>
                        <td>Waiting</td>
                        <td>{accountStats.waiting}</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>{accountStats.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="stats-section">
                  <h3>Account Roles</h3>
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Admin</td>
                        <td>{roleStats.admin}</td>
                      </tr>
                      <tr>
                        <td>Staff</td>
                        <td>{roleStats.staff}</td>
                      </tr>
                      <tr>
                        <td>Member</td>
                        <td>{roleStats.member}</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>{roleStats.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "pets" && (
              <div className="stats-section">
                <h3>Pet Statistics</h3>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Available</td>
                      <td>{petStats.available}</td>
                    </tr>
                    <tr>
                      <td>Unavailable</td>
                      <td>{petStats.unavailable}</td>
                    </tr>
                    <tr>
                      <td>Adopted</td>
                      <td>{petStats.adopted}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{petStats.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "events" && (
              <div className="stats-section">
                <h3>Event Statistics</h3>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Waiting</td>
                      <td>{eventStats.waiting}</td>
                    </tr>
                    <tr>
                      <td>Updating</td>
                      <td>{eventStats.updating}</td>
                    </tr>
                    <tr>
                      <td>Published</td>
                      <td>{eventStats.published}</td>
                    </tr>
                    <tr>
                      <td>Ending</td>
                      <td>{eventStats.ending}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{eventStats.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "donations" && (
              <div className="stats-section">
                <h3>Donation Statistics</h3>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Anonymous</td>
                      <td>{donationStats.anonymous}</td>
                    </tr>
                    <tr>
                      <td>Event Donations</td>
                      <td>{donationStats.eventDonate}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{donationStats.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
