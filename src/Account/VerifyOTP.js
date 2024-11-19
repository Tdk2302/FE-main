import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/axios";
import Spinner from "../components/Spinner";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

const VerifyOTP = ({ open, onClose, accountID, email, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        `/accounts/${accountID}/verifyOTP`,
        null,
        {
          params: { otp },
        }
      );

      if (response.data.status === 200) {
        toast.success(response.data.message);
        onSuccess();
        onClose();
        navigate("/login");
      }
    } catch (error) {
      toast.error("Invalid OTP or your OTP has expired");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.get(`/accounts/resendOTP/${accountID}`);
      if (response.data.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>Verify Your Email</DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Check your email for the verification code
            <br />
            It may take a few minutes
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {email}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Enter OTP"
          variant="outlined"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={handleVerifyOTP}
          sx={{
            bgcolor: "#f1cf7e",
            "&:hover": {
              bgcolor: "#e6be6a",
            },
            mr: 1,
          }}
        >
          Verify OTP
        </Button>
        <Button
          variant="outlined"
          onClick={handleResendOTP}
          sx={{
            color: "#6c757d",
            borderColor: "#6c757d",
            "&:hover": {
              bgcolor: "rgba(108, 117, 125, 0.04)",
              borderColor: "#6c757d",
            },
          }}
        >
          Resend OTP
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerifyOTP;
