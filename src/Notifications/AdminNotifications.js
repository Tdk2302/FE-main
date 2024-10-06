import React, { useState, useEffect, useCallback } from 'react';
import axios from "../services/axios";
import "../styles/adminpage.scss";
import { toast } from 'react-toastify';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState("other");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationCounts, setNotificationCounts] = useState({
        other: 0,
        addPet: 0,
        requestRegister: 0
    });
    
    const apiAdminNotifications = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [otherResponse, addPetResponse, requestRegisterResponse] = await Promise.all([
                axios.get("/notification/otherAdminNoti"),
                axios.get("/notification/showAdminAdoptNoti"),
                axios.get("/notification/showRegisNoti")
            ]);
            
            const processNotifications = (response) => {
                let data = response.data;
                if (typeof data === 'object' && data !== null) {
                    data = data.data || Object.values(data);
                }
                if (!Array.isArray(data)) {
                    console.warn('Unexpected data format:', data);
                    return [];
                }
                return data.map(noti => ({
                    ...noti,
                    isNew: !localStorage.getItem(`noti_${noti.notiID}_read`)
                }));
            };

            const otherData = processNotifications(otherResponse);
            const addPetData = processNotifications(addPetResponse);
            const requestRegisterData = processNotifications(requestRegisterResponse);
            
            setNotificationCounts({
                other: otherData.filter(noti => noti.isNew).length,
                addPet: addPetData.filter(noti => noti.isNew).length,
                requestRegister: requestRegisterData.filter(noti => noti.isNew).length
            });

            if (activeTab === "other") {
                setNotifications(otherData);
            } else if (activeTab === "addPet") {
                setNotifications(addPetData);
            } else if (activeTab === "requestRegister") {
                setNotifications(requestRegisterData);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('An error occurred. Please try again later.');
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        apiAdminNotifications();
    }, [apiAdminNotifications]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        // Mark all notifications in this tab as read
        notifications.forEach(noti => {
            localStorage.setItem(`noti_${noti.notiID}_read`, 'true');
        });
        // Update counts
        setNotificationCounts(prev => ({
            ...prev,
            [tab]: 0
        }));
    };

    const HandleStatusUpdate = async (notiID, status) => {
        try {
            console.log(`Updating notification ${notiID} with status ${status}`);
            const response = await axios.put(`notification/${notiID}/status?status=${status}`);
            console.log('Update response:', response);
            if (response.status === 200) {
                if (response.data === "Delete pet and notification") {
                    toast.success("Pet and notification deleted successfully");
                } else {
                    toast.success(`Notification ${status ? 'Accepted' : 'Denied'} successfully`);
                }
                localStorage.setItem(`noti_${notiID}_read`, 'true');
                apiAdminNotifications();
            }
        } catch (error) {
            console.error('Error updating notification status:', error);
            toast.error('Failed to update notification status');
        }
    }

    return (
        <div className="admin-notifications">
            <div className="sidebar-notifications">
                <h2>Notifications</h2>
                <ul>
                    <li
                        className={activeTab === 'other' ? 'active' : ''}
                        onClick={() => handleTabClick('other')}
                    >
                        Other
                        {notificationCounts.other > 0 && <span className="notification-count">{notificationCounts.other}</span>}
                    </li>
                    <li
                        className={activeTab === 'addPet' ? 'active' : ''}
                        onClick={() => handleTabClick('addPet')}
                    >
                        Add Pet
                        {notificationCounts.addPet > 0 && <span className="notification-count">{notificationCounts.addPet}</span>}
                    </li>
                    <li
                        className={activeTab === 'requestRegister' ? 'active' : ''}
                        onClick={() => handleTabClick('requestRegister')}
                    >
                        Request Register
                        {notificationCounts.requestRegister > 0 && <span className="notification-count">{notificationCounts.requestRegister}</span>}
                    </li>
                </ul>
            </div>
            <div className="notifications-content">
                <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map((noti) => (
                            <li key={noti.notiID} className={`notification-item ${noti.isNew ? 'new' : ''}`}>
                                <p>{noti.message}</p>
                                {(activeTab === 'addPet' || activeTab === 'requestRegister') && noti.button_status && (
                                    <div className="notification-actions">
                                        <button onClick={() => HandleStatusUpdate(noti.notiID, true)}>Accept</button>
                                        <button onClick={() => HandleStatusUpdate(noti.notiID, false)}>Deny</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notifications found</p>
                )}
            </div>            
        </div>
    );
};

export default AdminNotifications;