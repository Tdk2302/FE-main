import React, { useState, useEffect, useCallback } from "react";
import "../styles/appoitment.scss";
import moment from "moment";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import api from "../services/axios";
import { Link } from "react-router-dom";
const AppointmentPage = () => {
  // Các state để lưu trữ và quản lý dữ liệu
  const [unprocessedAppointments, setUnprocessedAppointments] = useState([]);
  const [processingAppointments, setProcessingAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("unprocessed");
  const [showModal, setShowModal] = useState(false);
  const [refusalReason, setRefusalReason] = useState("");
  const [appointmentToRefuse, setAppointmentToRefuse] = useState(null);
  const [notHappenAppointments, setNotHappenAppointments] = useState([]);
  const [endedAppointments, setEndedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy thông tin người dùng hiện tại từ localStorage

  const userID = localStorage.getItem("accountID");

  // Lấy danh sách cuộc hẹn chưa xử lý
  const apiUnprocessedAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("appointment/showUnprocessed");
      setUnprocessedAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching unprocessed appointments:", error);
      setUnprocessedAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Lấy danh sách cuộc hẹn đang chờ gặp mặt
  const apiNotHappenAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("appointment/showNotHappenedYet");
      setNotHappenAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching not happen appointments:", error);
      setNotHappenAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Lấy danh sách cuộc hẹn kết thúc
  const apiEndedAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("appointment/showEnded");
      setEndedAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching ended appointments:", error);
      setEndedAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Làm mới danh sách cuộc hẹn theo tab hiện tại
  const refreshAppointments = useCallback(async () => {
    if (activeTab === "unprocessed") {
      await apiUnprocessedAppointments();
    } else if (activeTab === "notHappenYet") {
      await apiNotHappenAppointments();
    } else if (activeTab === "ended") {
      await apiEndedAppointments();
    }
  }, [
    activeTab,
    apiUnprocessedAppointments,
    apiNotHappenAppointments,
    apiEndedAppointments,
  ]);

  // Gọi làm mới khi tab thay đổi
  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  // Xử lý chấp nhận cuộc hẹn ở bảng unprocessed
  const acceptAppointment = async (appointmentId) => {
    if (processingAppointments.includes(appointmentId)) {
      toast.error("This appointment is already being processed.");
      return;
    }
    setProcessingAppointments((prev) => [...prev, appointmentId]);
    try {
      const staffId = userID;
      const response = await api.put(`/appointment/accept/${staffId}`, {
        appointID: appointmentId,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error accepting appointment:", error);
    } finally {
      setProcessingAppointments((prev) =>
        prev.filter((id) => id !== appointmentId)
      );
      refreshAppointments();
    }
  };

  // Xử lý từ chối cuộc hẹn ở bảng unprocessed
  const refuseAppointment = (appointmentId) => {
    if (processingAppointments.includes(appointmentId)) {
      toast.error("This appointment is already being processed.");
      return;
    }
    setAppointmentToRefuse(appointmentId);
    setShowModal(true);
  };

  // Xử lý khi submit lý do từ chối
  const handleRefusalSubmit = async () => {
    if (!refusalReason.trim()) {
      toast.error("Please provide a reason for refusal.");
      return;
    }
    setProcessingAppointments((prev) => [...prev, appointmentToRefuse]);
    try {
      const response = await api.delete(
        `/appointment/refuse/${refusalReason}`,
        {
          data: { appointID: appointmentToRefuse },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);

      console.error(
        "Error refusing appointment:",
        error.response?.data || error.message
      );
    } finally {
      setProcessingAppointments((prev) =>
        prev.filter((id) => id !== appointmentToRefuse)
      );
      setShowModal(false);
      setRefusalReason("");
      setAppointmentToRefuse(null);
      refreshAppointments();
    }
  };
  // Xử lý chấp nhận cuộc hẹn ở bảng notHappenyet
  const handleFinalAccept = async (appointmentId) => {
    setProcessingAppointments((prev) => [...prev, appointmentId]);
    try {
      const staffId = userID;
      const response = await api.put(`/appointment/acceptAdopt/${staffId}`, {
        appointID: appointmentId,
      });
      console.log("API: ", response.data);
      toast.success(response.data.message);
    } catch (error) {
      // Hiển thị thông báo lỗi từ server
      toast.error(error.response.data.message);
    } finally {
      // Luôn refresh lại danh sách sau khi thực hiện, bất kể thành công hay thất bại
      refreshAppointments();
      // Xóa appointmentId khỏi danh sách đang xử lý
      setProcessingAppointments((prev) => prev.filter(id => id !== appointmentId));
    }
  };
  // Xử lý từ chối cuộc hẹn ở bảng notHappenyet
  const handleFinalRefuse = async (appointmentId) => {
    setProcessingAppointments((prev) => [...prev, appointmentId]);
    try {
      const staffId = userID;
      const response = await api.delete(`/appointment/refuseAdopt/${staffId}`, {
        data: { appointID: appointmentId },
      });
      toast.success(response.data.message);
    } catch (error) {
      // Hiển thị thông báo lỗi từ server
      toast.error(error.response.data.message);
    } finally {
      // Luôn refresh lại danh sách sau khi thực hiện, bất kể thành công hay thất bại
      refreshAppointments();
      // Xóa appointmentId khỏi danh sách đang xử lý
      setProcessingAppointments((prev) => prev.filter(id => id !== appointmentId));
    }
  };
  // Format ngày giờ
  const formatDateTime = (dateTimeString) => {
    return moment(dateTimeString).format("YYYY-MM-DD HH:mm:ss");
  };

  const renderStatus = (status) =>
    status === true ? "Processed" : "Unprocessed";

  const renderAdoptStatus = (adoptStatus) => {
    if (adoptStatus === undefined) return "Not set";
    return adoptStatus === true ? "Adopted" : "Not yet";
  };

  return (
    <div className="appointment-container">
      <div className="sidebar-appointment">
        <h2>Appointments</h2>
        <ul>
          <li
            className={activeTab === "unprocessed" ? "active" : ""}
            onClick={() => {
              setActiveTab("unprocessed");
              
            }}
          >
            Unprocessed
          </li>
          <li
            className={activeTab === "notHappenYet" ? "active" : ""}
            onClick={() => {
              setActiveTab("notHappenYet");
              
            }}
          >
            Not Happened Yet
          </li>
          <li
            className={activeTab === "ended" ? "active" : ""}
            onClick={() => {
              setActiveTab("ended");
            }}
          >
            Ended
          </li>
        </ul>
      </div>

      <div className="main-content">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {activeTab === "unprocessed" && (
              <>
                {unprocessedAppointments.length > 0 ? (
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Date Time</th>
                        <th>Account ID</th>
                        <th>Pet ID</th>
                        <th>Status</th>
                        <th>Adopt Status</th>
                        <th>Button</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unprocessedAppointments.map((appointment) => (
                        <tr key={appointment.appointID}>
                          <td>{formatDateTime(appointment.date_time)}</td>
                          <td>
                            <Link
                             to={`/profile/${appointment.accountID}`}
                             style={{
                                color: '#f1ba3a',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                             }}
                            >
                            {appointment.accountID}
                            </Link>
                          </td>
                          <td>
                            <Link 
                                to={`/petdetail/${appointment.petID}`}
                                style={{
                                    color: '#f1ba3a',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                {appointment.petID}
                            </Link>
                          </td>
                          <td>{renderStatus(appointment.status)}</td>
                          <td>{renderAdoptStatus(appointment.adopt_status)}</td>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                acceptAppointment(appointment.appointID)
                              }
                              disabled={processingAppointments.includes(
                                appointment.appointID
                              )}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                refuseAppointment(appointment.appointID)
                              }
                              disabled={processingAppointments.includes(
                                appointment.appointID
                              )}
                            >
                              Refuse
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-appointments">
                    No unprocessed appointments found.
                  </p>
                )}
              </>
            )}

            {activeTab === "notHappenYet" && (
              <>
                {notHappenAppointments.length > 0 ? (
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Date Time</th>
                        <th>Account ID</th>
                        <th>Pet ID</th>
                        <th>Staff ID</th>
                        <th>Status</th>
                        <th>Adopt Status</th>
                        <th>Button</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notHappenAppointments.map((appointment) => (
                        <tr key={appointment.appointID}>
                          <td>{formatDateTime(appointment.date_time)}</td>
                          <td>
                            <Link
                             to = {`/profile/${appointment.accountID}`}
                             style={{
                                color: '#f1ba3a',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                             }}
                            >
                            {appointment.accountID}
                            </Link>
                          </td>
                          <td>
                            <Link 
                                to={`/petdetail/${appointment.petID}`}
                                style={{
                                    color: '#f1ba3a',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                {appointment.petID}
                            </Link>
                          </td>
                          <td>{appointment.staffID}</td>
                          <td>{renderStatus(appointment.status)}</td>
                          <td>{renderAdoptStatus(appointment.adopt_status)}</td>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                handleFinalAccept(appointment.appointID)
                              }
                              disabled={processingAppointments.includes(
                                appointment.appointID
                              )}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                handleFinalRefuse(appointment.appointID)
                              }
                              disabled={processingAppointments.includes(
                                appointment.appointID
                              )}
                            >
                              Refuse
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-appointments">
                    No not happened yet appointments found.
                  </p>
                )}
              </>
            )}
            {activeTab === "ended" && (
              <>
                {endedAppointments.length > 0 ? (
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Date Time</th>
                        <th>Account ID</th>
                        <th>Pet ID</th>
                        <th>Staff ID</th>
                        <th>Status</th>
                        <th>Adopt Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endedAppointments.map((appointment) => (
                        <tr key={appointment.appointID}>
                          <td>{formatDateTime(appointment.date_time)}</td>
                          <td>
                          <Link
                            to={`/profile/${appointment.accountID}`}
                            style={{
                              color: '#f1ba3a',
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                            >
                            {appointment.accountID}
                            </Link>
                          </td>
                          <td>
                            <Link 
                                to={`/petdetail/${appointment.petID}`}
                                style={{
                                    color: '#f1ba3a',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                {appointment.petID}
                            </Link>
                          </td>
                          <td>{appointment.staffID}</td>
                          <td>{renderStatus(appointment.status)}</td>
                          <td>{renderAdoptStatus(appointment.adopt_status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-appointments">
                    No ended appointments found.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="appointment-refusal-modal">
          <div className="modal-content">
            <h2>Refuse Appointment</h2>
            <textarea
              value={refusalReason}
              onChange={(e) => setRefusalReason(e.target.value)}
              placeholder="Enter reason for refusal"
            />
            <div className="modal-buttons">
              <button onClick={handleRefusalSubmit}>Submit</button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRefusalReason("");
                  setAppointmentToRefuse(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
