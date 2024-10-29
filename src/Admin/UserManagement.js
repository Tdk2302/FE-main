import React, { useState, useEffect } from 'react';
import axios from '../services/axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Paper, 
  Button, 
  Typography,
  Box
} from '@mui/material';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/accounts/getAllAccounts');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (accountID, action) => {
    setActionLoading(prev => ({ ...prev, [accountID]: action }));
    try {
      const response = await axios.put(`/accounts/${accountID}/${action}`);
      
      // Hiển thị thông báo thành công với thời gian tùy chỉnh
      toast.success(response.data.message, {
        autoClose: 3000, // Thời gian hiển thị là 3 giây (3000ms)
        onClose: () => {
          // Sau khi thông báo đóng, refresh trang
          window.location.reload();
        }
      });
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast.error(`Failed to ${action} user. Please try again.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [accountID]: null }));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user management table">
          <TableHead>
            <TableRow>
              <TableCell>Account ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Button</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
              <TableRow key={user.accountID}>
                <TableCell>{user.accountID}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.roleID}</TableCell>
                <TableCell>{user.note}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['Upgrade', 'Enable', 'Disable'].map((action) => (
                      <Button 
                        key={action}
                        variant="contained" 
                        color={action === 'Disable' ? 'error' : action === 'Enable' ? 'success' : 'primary'}
                        onClick={() => handleAction(user.accountID, action)}
                        sx={{ 
                          minWidth: '80px', 
                          height: '30px',
                          fontSize: '0.75rem',
                          color: 'white',
                          '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#666'
                          }
                        }}
                        disabled={actionLoading[user.accountID] !== undefined}
                      >
                        {actionLoading[user.accountID] === action ? (
                          <Spinner size={20} />
                        ) : (
                          action
                        )}
                      </Button>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default UserManagement;