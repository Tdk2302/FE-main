import React, { useState, useEffect, useCallback } from "react";
import "../styles/appoitment.scss";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import api from "../services/axios";
import { Link } from "react-router-dom";
import moment from "moment";
import UserInfoModal from "../components/UserInfoModal";
import EditUserInfoModal from "../components/EditUserInfoModal";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, TextField } from "@mui/material";

const AppointmentPage = () => {
  const [unprocessedAppointments, setUnprocessedAppointments] = useState([]);
  const [processingAppointments, setProcessingAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("unprocessed");
  const [showRefusalModal, setShowRefusalModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [appointmentToRefuse, setAppointmentToRefuse] = useState(null);
  const [refusalReason, setRefusalReason] = useState("");
  const [notHappenAppointments, setNotHappenAppointments] = useState([]);
  const [reliableAppointments, setReliableAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    accountID: "",
    name: "",
    sex: "",
    birthdate: "",
    phone: "",
    address: "",
    total_donation: 0,
    married: "",
    job: "",
    income: 0,
    citizen_serial: "",
    experience_caring: "",
    confirm_address: "",
  });
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

  // Lấy danh sách cuộc hẹn đang trong quá trình xây dựng niềm tin
  const apiReliableAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("appointment/showReliableProcess");
      setReliableAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching reliable appointments:", error);
      setReliableAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const apiApprovedAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("appointment/showApproved");
      setApprovedAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching approved appointments:", error);
      setApprovedAppointments([]);
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
    } else if (activeTab === "reliable") {
      await apiReliableAppointments();
    } else if (activeTab === "approved") {
      await apiApprovedAppointments();
    }
  }, [
    activeTab,
    apiUnprocessedAppointments,
    apiNotHappenAppointments,
    apiReliableAppointments,
    apiApprovedAppointments,
  ]);

  // Gọi làm mới khi tab thay đổi
  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  // Xử lý chấp nhận cuộc hẹn ở bảng unprocessed
  const acceptAppointment = async (appointmentId) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // Xử lý từ chối cuộc hẹn ở bảng unprocessed
  const refuseAppointment = (appointmentId) => {
    setIsLoading(true);
    if (processingAppointments.includes(appointmentId)) {
      toast.error("This appointment is already being processed.");
      return;
    }
    setAppointmentToRefuse(appointmentId);
    setShowRefusalModal(true);
    setShowUserInfoModal(false);
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
      setShowRefusalModal(false);
      setRefusalReason("");
      setAppointmentToRefuse(null);
      refreshAppointments();
      setIsLoading(false);
    }
  };
  // Xử lý chấp nhận cuộc hẹn ở bảng notHappenyet
  const handleFinalAccept = async (appointmentId, accountId) => {
    setIsLoading(true);
    setProcessingAppointments((prev) => [...prev, appointmentId]);
    try {
      const staffId = userID;
      const response = await api.put(
        `/appointment/acceptAdopt/${staffId}/${accountId}`, 
        {
          appointID: appointmentId,
        }
      );
      toast.success(response.data.message);
      setShowEditUserInfoModal(false);
    } catch (error) {
      // Xử lý các trường hợp lỗi cụ thể
      if (error.response?.status === 404) {
        toast.error("Account didn't have enough confirmation information");
      } else if (error.response?.status === 409) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to accept appointment");
      }
    } finally {
      refreshAppointments();
      setProcessingAppointments((prev) => prev.filter(id => id !== appointmentId));
      setIsLoading(false);
    }
  };
  // Xử lý từ chối cuộc hẹn ở bảng notHappenyet
  const handleFinalRefuse = async (appointmentId) => {
    setIsLoading(true);
    setProcessingAppointments((prev) => [...prev, appointmentId]);
    try {
      const staffId = userID;
      const response = await api.delete(`/appointment/refuseAdopt/${staffId}`, {
        data: { appointID: appointmentId },
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      // Luôn refresh lại danh sách sau khi thực hiện, bất kể thành công hay thất bại
      refreshAppointments();
      // Xóa appointmentId khỏi danh sách đang xử lý
      setProcessingAppointments((prev) => prev.filter(id => id !== appointmentId));
      setIsLoading(false);
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

  const renderApproveStatus = (approveStatus) => {
    return approveStatus === true ? "Approved" : "Not yet";
  };

  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchUserInfo = async (accountID) => {
    setIsModalLoading(true);
    try {
      const response = await api.get(`accounts/getConfirm/${accountID}`);
      console.log("API Response:", response.data);
      const userData = response.data.data;
      setSelectedUserInfo(userData);
      setUserInfo(userData);
    } catch (error) {
      toast.error("Failed to fetch user information");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleLinkClick = async (accountID) => {
    await fetchUserInfo(accountID); 
    setShowUserInfoModal(true); 
  };

  const [showEditUserInfoModal, setShowEditUserInfoModal] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState({});

  const handleUpdateUserInfo = async (data) => {
    setIsLoading(true);
    const { accountID, params } = data;
    try {
      // Chuyển params thành query string
      const queryString = new URLSearchParams(params).toString();
      const response = await api.put(
        `/accounts/confirmationInfor/${accountID}?${queryString}`
      );
      toast.success(response.data.message);
      setShowEditUserInfoModal(false);
    } catch (error) {
      toast.error("Failed to update user information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptClick = async (accountID, appointID) => {
    setIsLoading(true);
    try {
      const response = await api.get(`accounts/getConfirm/${accountID}`);
      const userData = response.data.data;
      // Kết hợp userData với appointID
      setSelectedUserInfo({
        ...userData,
        appointID: appointID  // Thêm appointID vào cùng với dữ liệu user
      });
      setShowEditUserInfoModal(true);
    } catch (error) {
      toast.error("Failed to fetch user information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrustClick = async (appointID) => {
    setIsLoading(true);
    setProcessingAppointments(prev => [...prev, appointID]); // Disable button ngay lập tức
    
    try {
      const staffId = userID;
      const response = await api.post(`notification/requestTrust/${appointID}/${staffId}`);
      if (response.data.message) {
        toast.success(response.data.message);
        setReliableAppointments(prev => 
          prev.filter(appointment => appointment.appointID !== appointID)
        );
      } else {
        toast.error("Failed to request trust");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request trust");
    } finally {
      setProcessingAppointments(prev => 
        prev.filter(id => id !== appointID)
      );
      setIsLoading(false);
    }
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
            className={activeTab === "reliable" ? "active" : ""}
            onClick={() => {
              setActiveTab("reliable");
            }}
          >
            Reliable Process
          </li>
          <li
            className={activeTab === "approved" ? "active" : ""}
            onClick={() => {
              setActiveTab("approved");
            }}
          >
            Approved
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
                              to="#"
                              onClick={() => handleLinkClick(appointment.accountID)}
                              style={{ color: '#f1ba3a', textDecoration: 'underline', cursor: 'pointer' }}
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
                             to="#"
                             onClick={() => handleLinkClick(appointment.accountID)}
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
                              onClick={() => handleAcceptClick(appointment.accountID, appointment.appointID)}
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
            {activeTab === "reliable" && (
              <>
                {reliableAppointments.length > 0 ? (
                  <table className="appointments-table">
                    <thead>
                      <tr>
                        <th>Date Time</th>
                        <th>Account ID</th>
                        <th>Pet ID</th>
                        <th>Staff ID</th>
                        <th>Status</th>
                        <th>Adopt Status</th>
                        <th>Video Report</th>
                        <th>Button</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reliableAppointments.map((appointment) => (
                        <tr key={appointment.appointID}>
                          <td>{formatDateTime(appointment.date_time)}</td>
                          <td>
                          <Link
                            to="#"
                            onClick={() => handleLinkClick(appointment.accountID)}
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
                          
                          <td> <a href={appointment.video_report} target="_blank" rel="noopener noreferrer">Video Report</a> </td>
                          <td>
                            <button 
                              className="btn btn-success"
                              onClick={() => handleTrustClick(appointment.appointID)}
                              disabled={processingAppointments.includes(appointment.appointID)}
                            >
                              Trust
                            </button>
                            <button className="btn btn-danger">Recall Pet</button>
                          </td>
                        </tr> 
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-appointments">
                    No reliable process appointments found.
                  </p>
                )}
              </>
            )}

            {activeTab === "approved" && (
              <>
                {approvedAppointments.length > 0 ? (
                  <table className="appointments-table">
                      <thead>
                      <tr>
                        <th>Date Time</th>
                        <th>Account ID</th>
                        <th>Pet ID</th>
                        <th>Staff ID</th>
                        <th>Status</th>
                        <th>Adopt Status</th>
                        <th>Approve Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedAppointments.map((appointment) => (
                        <tr key={appointment.appointID}>
                          <td>{formatDateTime(appointment.date_time)}</td>
                          <td>
                          <Link
                            to="#"
                            onClick={() => handleLinkClick(appointment.accountID)}
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
                          <td>{renderApproveStatus(appointment.approve_status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-appointments">
                    No approved appointments found.
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
      {isModalLoading && <Spinner />}
      <UserInfoModal 
        open={showUserInfoModal} 
        onClose={() => setShowUserInfoModal(false)} 
        userInfo={userInfo} 
      />
      {/* Modal từ chối cuộc hẹn */}
      <Dialog open={showRefusalModal} onClose={() => setShowRefusalModal(false)}>
        <DialogTitle>Refuse Appointment</DialogTitle>
        <DialogContent>
          <p>Enter reason for refusal:</p>
          <textarea
            value={refusalReason}
            onChange={(e) => setRefusalReason(e.target.value)}
            placeholder="Enter reason for refusal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRefusalModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRefusalSubmit} color="secondary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <EditUserInfoModal 
        open={showEditUserInfoModal} 
        onClose={() => setShowEditUserInfoModal(false)} 
        userInfo={selectedUserInfo} 
        onUpdate={handleUpdateUserInfo} 
        onAccept={handleFinalAccept}
      />
    </div>
  );
};

export default AppointmentPage;
