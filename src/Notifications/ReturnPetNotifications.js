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
        console.log(notifications);
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

  const formatMessage = (message) => {
    const parts = message.split(".");
    const mainInfo = parts[0].trim();
    const reason = parts[1]?.trim();
    const action = parts[2]?.trim();

    const appointmentIDMatch = message.match(/appointment:\s*([a-zA-Z0-9]+)/);
    const appointmentID = appointmentIDMatch ? appointmentIDMatch[1] : null;

    return (
      <div>
        <p>{mainInfo}.</p>
        {reason && (
          <p>
            <strong>{reason}.</strong>
          </p>
        )}
        {action && (
          <p>
            <em>{action}.</em>
          </p>
        )}
      </div>
    );
  };

  const handleDone = async (appointmentID) => {
    setIsUpdating(true);
    try {
      const response = await api.put(
        `/appointment/notTrust/${appointmentID}`,
        null,
        {
          params: {
            reason: "",
          },
        }
      );
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
            {notifications.map((noti) => {
              const appointmentID = formatMessage(noti.message).props
                .children[3]?.props.children;
              return (
                <li
                  key={noti.notiID}
                  className={`notification-item ${
                    noti.button_status ? "new" : ""
                  }`}
                >
                  <div className="notification-message">
                    {formatMessage(noti.message)}
                  </div>
                  <p className="notification-date">
                    {formatRelativeTime(noti.createdAt)}
                  </p>
                  {noti.button_status && (
                    <div>
                      <button
                        className="notification-done1"
                        onClick={() => handleDone(appointmentID)}
                      >
                        Done
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No return pet notifications found</p>
        )}
      </div>
    </div>
  );
};

export default ReturnPetNotifications;
