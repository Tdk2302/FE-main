import { useCallback, useEffect, useState } from "react";
import axios from "../services/axios";
import "../styles/notification.scss";

const Notification = ({ roleID }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const apiNotifications = useCallback(async () => {
        try {
            let response;
            if (roleID === "1") {
                response = await axios.get("notification/otherAdminNoti");
            } else if (roleID === "2") {
                response = await axios.get("notification/showStaffNoti");
            } else if (roleID === "3") {
                response = await axios.get("notification/memberNoti");
            }
            console.log("API response:", response);

            if (response && response.data) {
                const notificationData = response.data.data || response.data;
                const processedNotifications = Array.isArray(notificationData) 
                    ? notificationData.map(noti => ({
                        ...noti,
                        isRead: localStorage.getItem(`noti_${noti.notiID}_read`) === 'true'
                    }))
                    : [];
                setNotifications(processedNotifications);
                setUnreadCount(processedNotifications.filter(noti => !noti.isRead).length);
            } else {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [roleID]);

    useEffect(() => {
        apiNotifications();
        const interval = setInterval(apiNotifications, 60000);
        return () => clearInterval(interval);
    }, [apiNotifications]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            markAllAsRead();
        }
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(noti => {
            if (!noti.isRead) {
                localStorage.setItem(`noti_${noti.notiID}_read`, 'true');
                return { ...noti, isRead: true };
            }
            return noti;
        });
        setNotifications(updatedNotifications);
        setUnreadCount(0);
    };

    return (
        <div className="notification-bell">
            <i className="fa-solid fa-bell" onClick={toggleDropdown}></i>
            {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
            {showDropdown && (
                <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className={`notification-item ${notification.isRead ? '' : 'unread'}`}>
                                {notification.message}
                            </div>
                        ))
                    ) : (
                        <div className="notification-item">No new notifications</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;