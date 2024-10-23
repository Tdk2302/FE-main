import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../services/axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Avatar,
  Chip
} from "@mui/material";
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Spinner from "../components/Spinner"; // Import Spinner component
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HomeIcon from '@mui/icons-material/Home';
import { format } from 'date-fns';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  margin: 'auto',
  backgroundColor: '#f0f0f0',
  color: '#333333',
}));

const ProfileUser = () => {
  const [userInfo, setUserInfo] = useState({
    accountID: "",
    name: "",
    sex: "",
    birthdate: "",
    phone: "",
    address: "",
    total_donation: 0,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  };


  useEffect(() => {
    fetchUserInfo();
  }, [navigate]);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const accountID = decodedToken.sub;

      const response = await api.get(`accounts/search/${accountID}`);
      const userData = response.data || {
        accountID: "",
        name: "",
        sex: "",
        birthdate: "",
        phone: "",
        address: "",
        total_donation: 0,
      };
      
      if (userData.birthdate) {
        userData.birthdate = new Date(userData.birthdate);
      }
      
      setUserInfo(userData);
    } catch (error) {
      toast.error("Failed to fetch user information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "birthdate") {
      const dateValue = new Date(value);
      setUserInfo(prevState => ({ ...prevState, [name]: dateValue }));
    } else {
      setUserInfo(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleOpenDialog = (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPassword("");
  };

  const handleUpdate = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password to update");
      return;
    }
    try {
      const userInfoToUpdate = { ...userInfo };
      if (userInfoToUpdate.birthdate) {
        userInfoToUpdate.birthdate = format(userInfoToUpdate.birthdate, 'MM/dd/yyyy');
      }
      
      // Luôn gửi trường password, dù là mật khẩu mới hoặc chuỗi rỗng
      userInfoToUpdate.password = newPassword.trim();

      // Sử dụng currentPassword trong URL để xác thực
      const response = await api.put(`accounts/update/${currentPassword}`, userInfoToUpdate);
      console.log("Update response:", response);
      toast.success("User information updated successfully!");
      handleCloseDialog();
      setIsEditing(false);
      setNewPassword(""); // Reset newPassword sau khi cập nhật
      fetchUserInfo();
    } catch (error) {
      console.error("Error updating user info:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        toast.error("Wrong current password. Please try again.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to update this profile.");
      } else if (error.response?.status === 404) {
        toast.error("Account not found. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Failed to update user information. Please try again later.");
      }
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset newPassword when entering edit mode
      setNewPassword("");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  if (isLoading) {
    return <Spinner />; 
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ my: 5 }}>
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <ProfileAvatar src={getImageUrl(userInfo.avatarUrl)}>
            {!userInfo.avatarUrl && (userInfo.name ? userInfo.name[0].toUpperCase() : 'U')}
          </ProfileAvatar>
          <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: '#333333' }}>
            {userInfo.name || "User Profile"}
          </Typography>
          <Chip 
            icon={<EditIcon />} 
            label={isEditing ? "Editing" : "Edit Profile"} 
            onClick={toggleEdit}
            color="default"
            sx={{ mt: 2, backgroundColor: '#f0f0f0', '&:hover': { backgroundColor: '#e0e0e0' } }}
          />
        </Box>
        <Box component="form" onSubmit={handleOpenDialog} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={userInfo.name || ""}
                onChange={handleChange}
                InputProps={{ 
                  readOnly: !isEditing,
                  startAdornment: <PersonIcon sx={{ mr: 1, color: '#757575' }} />
                }}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="sex-label">Sex</InputLabel>
                <Select
                  labelId="sex-label"
                  id="sex"
                  name="sex"
                  value={userInfo.sex || ""}
                  label="Sex"
                  onChange={handleChange}
                  inputProps={{ readOnly: !isEditing }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Birthdate"
                name="birthdate"
                type="date"
                value={userInfo.birthdate ? format(userInfo.birthdate, 'yyyy-MM-dd') : ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{ 
                  readOnly: !isEditing,
                  startAdornment: <CakeIcon sx={{ mr: 1, color: '#757575' }} />
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={userInfo.phone || ""}
                onChange={handleChange}
                InputProps={{ 
                  readOnly: !isEditing,
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: '#757575' }} />
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Donation"
                name="total_donation"
                value={formatCurrency(userInfo.total_donation || 0)}
                InputProps={{ 
                  readOnly: true,
                  startAdornment: <MonetizationOnIcon sx={{ mr: 1, color: '#757575' }} />
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={userInfo.address || ""}
                onChange={handleChange}
                InputProps={{ 
                  readOnly: !isEditing,
                  startAdornment: <HomeIcon sx={{ mr: 1, color: '#757575' }} />
                }}
                variant="outlined"
              />
            </Grid>
            {isEditing && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password (Optional)"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={toggleNewPasswordVisibility}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
          {isEditing && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                height: 56, 
                fontSize: '1.2rem',
                backgroundColor: '#333333',
                '&:hover': {
                  backgroundColor: '#555555',
                },
              }}
            >
              Update Profile
            </Button>
          )}
        </Box>
      </StyledPaper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your current password to update your profile.
            {newPassword && " Your password will be updated."}
          </DialogContentText>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <TextField
              autoFocus
              margin="dense"
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={toggleCurrentPasswordVisibility}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#333333' }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" sx={{ backgroundColor: '#333333', '&:hover': { backgroundColor: '#555555' } }}>
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfileUser;
