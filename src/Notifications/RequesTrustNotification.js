import React, { useState, useEffect, useCallback } from 'react';
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from 'react-toastify';
import moment from 'moment';
import Spinner from "../components/Spinner";
import { useNavigate } from 'react-router-dom';

const RequesTrustNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newNotificationsCount, setNewNotificationsCount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const apiRequestTrustNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get("/notification/showTrustRequest");
            console.log("API Response:", response.data);
            if (response.data && response.data.data) {
                const notifications = response.data.data;
                const pendingCount = notifications.filter(noti => noti.button_status).length;
                console.log("Pending count:", pendingCount);
                setNewNotificationsCount(pendingCount);
                setNotifications(notifications);
            } else {
                setNotifications([]);
                setNewNotificationsCount(0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
            setNewNotificationsCount(0);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        apiRequestTrustNotifications();
    }, [apiRequestTrustNotifications]);

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'Date not available';
        const date = moment(dateString);
        if (!date.isValid()) return 'Invalid Date';
        
        const now = moment();
        const diffHours = now.diff(date, 'hours');
        
        if (diffHours < 24) {
          return date.fromNow();
        } else {
          return date.format('MMMM D, YYYY HH:mm');
        }
      };
    
      const handleAccept = async (notiID) => {
        setIsUpdating(true);
        try {
          const response = await axios.put(`appointment/trust/${notiID}`);
          if (response.status === 200 && response.data.message) {
            toast.success(response.data.message);
            await apiRequestTrustNotifications();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to accept trust request");
        } finally {
          setIsUpdating(false);
        }
      };
    
      const handleDeny = async (notiID) => {
        setIsUpdating(true);
        try {
          const response = await axios.delete(`/notification/refuseTrustRequest/${notiID}`);
          if (response.status === 200 && response.data.message) {
            toast.success(response.data.message);
            await apiRequestTrustNotifications();
          }
        } catch (error) {
          if (error.response?.status === 404) {
            toast.error("Request not found");
          } else if (error.response?.status === 400) {
            toast.error("Invalid request");
          } else {
            toast.error(error.response?.data?.message || "Failed to refuse trust request");
          }
        } finally {
          setIsUpdating(false);
        }
      };
    
      const handleReportClick = async (petID) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/pets/getByID/${petID}`);
            const pet = response.data.data;
            if (pet) {
                navigate(`/reportdetail/${petID}`, { state: { pet } });
            }
        } catch (error) {
            console.error("Error fetching pet info:", error);
            toast.error("Failed to fetch pet information");
        } finally {
            setIsLoading(false);
        }
    };
    
      if (isLoading || isUpdating) {
        return <Spinner />;
    }
    return (
        <div className="admin-notifications">
      <div className="notifications-content">
        <h2>
          Request Trust Notifications{" "}
          {newNotificationsCount > 0 && (
            <span className="notification-count">
              ({newNotificationsCount})
            </span>
          )}
        </h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((noti) => (
              <li
                key={noti.notiID}
                className={`notification-item ${noti.button_status ? "new" : ""}`}
              >
                <div className="notification-message">{noti.message}</div>
                <button
                    onClick={() => handleReportClick(noti.petID)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#534ee1',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                >
                    Video Report
                </button>
                <p className="notification-date">
                  {formatRelativeTime(noti.createdAt)}
                </p>
                {noti.button_status && (
                  <div className="notification-actions">
                    <button onClick={() => handleAccept(noti.notiID)}>
                      Accept
                    </button>
                    <button onClick={() => handleDeny(noti.notiID)}>
                      Deny
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No register request notifications found</p>
        )}
      </div>
    </div>
    );
};

export default RequesTrustNotification;