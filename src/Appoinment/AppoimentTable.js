import React, { useState, useEffect, useCallback } from 'react';
import axios from '../services/axios';
import '../styles/appoitment.scss';
import moment from 'moment';
import { toast } from 'react-toastify';

const AppointmentPage = () => {
    // Các state để lưu trữ và quản lý dữ liệu
    const [unprocessedAppointments, setUnprocessedAppointments] = useState([]);
    const [processedAppointments, setProcessedAppointments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [processingAppointments, setProcessingAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('unprocessed');
    const [showModal, setShowModal] = useState(false);
    const [refusalReason, setRefusalReason] = useState('');
    const [appointmentToRefuse, setAppointmentToRefuse] = useState(null);

    // Lấy thông tin người dùng hiện tại từ localStorage
    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setCurrentUser(user);
        }
    }, []);

    // Lấy danh sách cuộc hẹn chưa xử lý
    const apiUnprocessedAppointments = useCallback(async () => {
        try {
            const response = await axios.get('appointment/showUnprocessed');
            setUnprocessedAppointments(response.data);
        } catch (error) {
            console.error('Error fetching unprocessed appointments:', error);
            setUnprocessedAppointments([]);
        }
    }, []);

    // Lấy danh sách cuộc hẹn đã xử lý
    const apiProcessedAppointments = useCallback(async () => {
        try {
            const response = await axios.get('appointment/showProcessed');
            setProcessedAppointments(response.data);
        } catch (error) {
            console.error('Error fetching processed appointments:', error);
            setProcessedAppointments([]);
        }
    }, []);

    // Làm mới danh sách cuộc hẹn theo tab hiện tại
    const refreshAppointments = useCallback(async () => {
        if (activeTab === 'unprocessed') {
            await apiUnprocessedAppointments();
        } else {
            await apiProcessedAppointments();
        }
    }, [activeTab, apiUnprocessedAppointments, apiProcessedAppointments]);

    // Gọi làm mới khi tab thay đổi
    useEffect(() => {
        refreshAppointments();
    }, [refreshAppointments]);

    // Xử lý chấp nhận cuộc hẹn
    const acceptAppointment = async (appointmentId) => {
        if (processingAppointments.includes(appointmentId)) {
            toast.error('This appointment is already being processed.');
            return;
        }
        setProcessingAppointments(prev => [...prev, appointmentId]);
        try {
            const staffId = currentUser.accountID;
            const response = await axios.put(`/appointment/accept/${staffId}`, { appointID: appointmentId });
            const updatedAppointment = response.data;

            setUnprocessedAppointments(prev => prev.filter(app => app.appointID !== appointmentId));
            setProcessedAppointments(prev => [...prev, updatedAppointment]);
            toast.success('Appointment accepted successfully.');
            refreshAppointments();
        } catch (error) {
            console.error('Error accepting appointment:', error);
            toast.error('Failed to accept appointment. Please try again.');
        } finally {
            setProcessingAppointments(prev => prev.filter(id => id !== appointmentId));
        }
    };

    // Xử lý từ chối cuộc hẹn
    const refuseAppointment = (appointmentId) => {
        if (processingAppointments.includes(appointmentId)) {
            toast.error('This appointment is already being processed.');
            return;
        }
        setAppointmentToRefuse(appointmentId);
        setShowModal(true);
    };

    // Xử lý khi submit lý do từ chối
    const handleRefusalSubmit = async () => {
        if (!refusalReason.trim()) {
            toast.error('Please provide a reason for refusal.');
            return;
        }
        setProcessingAppointments(prev => [...prev, appointmentToRefuse]);
        try {
            await axios.delete(`/appointment/refuse/${refusalReason}`, { data: { appointID: appointmentToRefuse } });
            setUnprocessedAppointments(prev => prev.filter(app => app.appointID !== appointmentToRefuse));
            toast.success('Appointment refused successfully.');
            refreshAppointments();
        } catch (error) {
            console.error('Error refusing appointment:', error.response?.data || error.message);
            toast.error('Failed to refuse appointment. Please try again.');
        } finally {
            setProcessingAppointments(prev => prev.filter(id => id !== appointmentToRefuse));
            setShowModal(false);
            setRefusalReason('');
            setAppointmentToRefuse(null);
        }
    };

    // Format ngày giờ
    const formatDateTime = (dateTimeString) => {
        return moment(dateTimeString).format('YYYY-MM-DD HH:mm:ss');
    };

    return (
        <div className="appointment-container">
            <div className="sidebar">
                <h2>Appointments</h2>
                <ul>
                    <li
                        className={activeTab === 'unprocessed' ? 'active' : ''}
                        onClick={() => {
                            setActiveTab('unprocessed');
                            apiUnprocessedAppointments();
                        }}
                    >
                        Unprocessed Appointments
                    </li>
                    <li
                        className={activeTab === 'processed' ? 'active' : ''}
                        onClick={() => {
                            setActiveTab('processed');
                            apiProcessedAppointments();
                        }}
                    >
                        Processed Appointments
                    </li>
                </ul>
            </div>

            <div className="main-content">
                {activeTab === 'unprocessed' && (
                    <>
                        <h2>Unprocessed Appointments</h2>
                        {unprocessedAppointments.length > 0 ? (
                            <table className="appointments-table">
                                <thead>
                                    <tr>
                                        <th>Date Time</th>
                                        <th>Account ID</th>
                                        <th>Pet ID</th>
                                        <th>Staff ID</th>
                                        <th>Button</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unprocessedAppointments.map(appointment => (
                                        <tr key={appointment.appointID}>
                                            <td>{formatDateTime(appointment.date_time)}</td>
                                            <td>{appointment.accountID}</td>
                                            <td>{appointment.petID}</td>
                                            <td>{appointment.staffID}</td>
                                            <td>
                                                <button onClick={() => acceptAppointment(appointment.appointID)} disabled={processingAppointments.includes(appointment.appointID)}>Accept</button>
                                                <button onClick={() => refuseAppointment(appointment.appointID)} disabled={processingAppointments.includes(appointment.appointID)}>Refuse</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-appointments">No unprocessed appointments found.</p>
                        )}
                    </>
                )}

                {activeTab === 'processed' && (
                    <>
                        <h2>Processed Appointments</h2>
                        {processedAppointments.length > 0 ? (
                            <table className="appointments-table">
                                <thead>
                                    <tr>
                                        <th>Date Time</th>
                                        <th>Account ID</th>
                                        <th>Pet ID</th>
                                        <th>Staff ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedAppointments.map(appointment => (
                                        <tr key={appointment.appointID}>
                                            <td>{formatDateTime(appointment.date_time)}</td>
                                            <td>{appointment.accountID}</td>
                                            <td>{appointment.petID}</td>
                                            <td>{appointment.staffID}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-appointments">No processed appointments found.</p>
                        )}
                    </>
                )}
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Refuse Appointment</h2>
                        <textarea value={refusalReason} onChange={(e) => setRefusalReason(e.target.value)} placeholder="Enter reason for refusal" />
                        <div className="modal-buttons">
                            <button onClick={handleRefusalSubmit}>Submit</button>
                            <button onClick={() => {
                                setShowModal(false);
                                setRefusalReason('');
                                setAppointmentToRefuse(null);
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentPage;
