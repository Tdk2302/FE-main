import React, { useState, useEffect, useCallback } from "react";
import api, { BASE_URL } from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from "react-toastify";
import moment from "moment";
import Spinner from "../components/Spinner";

const ReturnPetNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const apiReturnPetNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`${BASE_URL}notification/showReturnPet`);
      if (response.data && response.data.data) {
        const notifications = response.data.data;
        const pendingCount = notifications.filter(
          (noti) => noti.button_status
        ).length;
        setNewNotificationsCount(pendingCount);
        setNotifications(notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    apiReturnPetNotifications();
  }, [apiReturnPetNotifications]);

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Date not available";
    const date = moment(dateString);
    if (!date.isValid()) return "Invalid Date";

    const now = moment();
    const diffHours = now.diff(date, "hours");

    if (diffHours < 24) {
      return date.fromNow();
    } else {
      return date.format("MMMM D, YYYY HH:mm");
    }
  };

  const handleDone = async (notiID) => {
    setIsUpdating(true);
    try {
      const response = await api.put(`/appointment/notTrust/${notiID}`);
      if (response.status === 200) {
        toast.success("Return pet request marked as done");
        apiReturnPetNotifications(); // Refresh the notifications
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to mark request as done"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || isUpdating) {
    return <Spinner />;
  }

  return (
    <div className="admin-notifications">
      <div className="notifications-content">
        <h2>
          Return Pet Notifications{" "}
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
                className={`notification-item ${
                  noti.button_status ? "new" : ""
                }`}
              >
                <div className="notification-message">{noti.message}</div>
                <p className="notification-date">
                  {formatRelativeTime(noti.createdAt)}
                </p>
                {noti.button_status && (
                  <div className="notification-actions">
                    <button onClick={() => handleDone(noti.notiID)}>
                      Done
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No return pet notifications found</p>
        )}
      </div>
    </div>
  );
};

export default ReturnPetNotifications;
