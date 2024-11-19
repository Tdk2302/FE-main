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
import { Password } from "@mui/icons-material";

const ForgotPassword = ({ open, onClose }) => {
  const [username, setUsername] = useState("");
  const [otpDialogOpen, setOtpDialogOpen] = useState(false); // State to control OTP dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false); // State to control password dialog
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password

  const handleSubmitUsername = async () => {
    try {
      const response = await api.get("accounts/forgetpassword", {
        params: { accountID: username },
      });
      console.log("API Response:", response); // Log API response
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setOtpDialogOpen(true); // Open OTP dialog
      }
    } catch (error) {
      console.error("Error:", error); // Log error
      toast.error(error.response.data.message);
    }
  };

  const handleOtpSuccess = () => {
    console.log("handleOtpSuccess called"); // Log to confirm function is called
    setOtpDialogOpen(false); // Close OTP dialog
    setPasswordDialogOpen(true); // Open password change dialog
    console.log("OTP verified successfully, opening change password dialog."); // Debugging log
    console.log("passwordDialogOpen state:", passwordDialogOpen); // Log the state change
  };

  const handleChangePassword = async () => {
    if (newPassword == null && confirmPassword == null) {
      toast.error("Please enter password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      console.log(username, newPassword);
      const response = await api.put(`/accounts/changePass`, {
        params: { accountID: username, password: newPassword },
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
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Enter Username</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitUsername}>Continue</Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* VerifyOTP Dialog */}
      <VerifyOTP
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        accountID={username} // Pass the username as accountID
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

export default ForgotPassword;
