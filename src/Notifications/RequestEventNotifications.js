import React, { useState, useEffect, useCallback } from "react";
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from "react-toastify";
import moment from "moment";
import Spinner from "../components/Spinner";

const RequestEventNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const extractEventID = (message) => {
    const match = message.match(/ID: (\w+)/);
    return match ? match[1] : null;
  };

  const apiEventNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/notification/showEventNoti");
      if (response.data && response.data.data) {
        const notifications = response.data.data;
        const pendingCount = notifications.filter(noti => noti.button_status).length;
        setNewNotificationsCount(pendingCount);
        setNotifications(notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching event notifications:', error);
      setError('No notifications found');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    apiEventNotifications();
  }, [apiEventNotifications]);

  const handleStatusUpdate = async (noti, status) => {
    const eventID = extractEventID(noti.message);
    if (!eventID) {
      toast.error('Invalid eventID');
      return;
    }
    setIsUpdating(true);
    try {
      const response = await axios.put(`/events/${eventID}/status?status=${status}`);
      if (response.status === 200) {
        setNotifications(prev => {
          const updatedNotifications = prev.map(n => 
            n.notiID === noti.notiID
            ? { ...n, button_status: false }
            : n
          );
          const newCount = updatedNotifications.filter(n => n.button_status).length;
          setNewNotificationsCount(newCount);
          return updatedNotifications;
        });

        toast.success(`Notification ${status ? 'Accepted' : 'Denied'} successfully`);
        apiEventNotifications();
      } else {
        throw new Error(response.data.message || 'Failed to update event status');
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update event status');
      
      if (error.response?.status === 404) {
        setNotifications(prev => {
          const updatedNotifications = prev.filter(n => n.notiID !== noti.notiID);
          const newCount = updatedNotifications.filter(n => n.isNew).length;
          setNewNotificationsCount(newCount);
          return updatedNotifications;
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

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

  const formatMessage = (message) => {
    const lines = message.split('\n');
    const columnLength = Math.ceil(lines.length / 3);
    return (
      <div className="notification-message-container">
        <div className="notification-message-column">
          {lines.slice(0, columnLength).join('\n')}
        </div>
        <div className="notification-message-column">
          {lines.slice(columnLength, 2 * columnLength).join('\n')}
        </div>
        <div className="notification-message-column">
          {lines.slice(2 * columnLength).join('\n')}
        </div>
      </div>
    );
  };

  if (isLoading || isUpdating) {
    return <Spinner />;
  }

  return (
    <div className="admin-notifications">
      <div className="notifications-content">
        <h2>
          Event Request Notifications{" "}
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
                {formatMessage(noti.message)}
                <p className="notification-date">
                  {formatRelativeTime(noti.createdAt)}
                </p>
                {noti.button_status && (
                  <div className="notification-actions">
                    <button
                      onClick={() => handleStatusUpdate(noti, true)}
                      disabled={isUpdating}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(noti, false)}
                      disabled={isUpdating}
                    >
                      Deny
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No event notifications found</p>
        )}
      </div>
    </div>
  );
};

export default RequestEventNotifications;
