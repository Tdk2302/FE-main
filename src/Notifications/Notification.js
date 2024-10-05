import { useCallback, useEffect, useState } from "react";
import axios from "../services/axios";
import "../styles/notification.scss";
const Notification = ({ roleID }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
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
            setNotifications(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        }
    }, [roleID]);

    useEffect(() => {
        apiNotifications();
        const interval = setInterval(apiNotifications, 60000); // Refresh notifications every 60 seconds
        return () => clearInterval(interval); // Cleanup on component unmount
    }, [apiNotifications]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    return (
        <div className="notification-bell">
            <i className="fa-solid fa-bell" onClick={toggleDropdown}></i>
            {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
            {showDropdown && (
                <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={index} className="notification-item">
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