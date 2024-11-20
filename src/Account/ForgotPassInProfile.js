import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import VerifyOTP from "./VerifyOTP"; // Import VerifyOTP component

const ForgotInProfile = ({ open, onClose }) => {
  const [otpDialogOpen, setOtpDialogOpen] = useState(true); // State to control OTP dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false); // State to control password dialog
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const currentAccountID = localStorage.getItem("accountID");

  const handleOtpSuccess = () => {
    setOtpDialogOpen(false); // Close OTP dialog
    setPasswordDialogOpen(true); // Open password change dialog
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await api.put(`/accounts/changePass`, null, {
        params: {
          accountID: currentAccountID,
          password: newPassword,
        },
      });
      toast.success(response.data.message);
      onClose(); // Close the dialog
      setPasswordDialogOpen(false); // Close password dialog
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  return (
    <>
      {/* VerifyOTP Dialog */}
      <VerifyOTP
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        accountID={currentAccountID} // Pass the currentAccountID
        onSuccess={handleOtpSuccess} // Callback for successful OTP verification
      />

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            sx={{ mt: 2 }} // Add margin top for spacing
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangePassword}>Change Password</Button>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForgotInProfile;
