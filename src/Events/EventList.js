import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';
import '../styles/events.scss';
import { toast } from 'react-toastify';
import { Card, Button as BootstrapButton, CardGroup } from 'react-bootstrap';
import Spinner from "../components/Spinner";
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

// Transition component
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const roleID = localStorage.getItem('roleID');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(12);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [roleID]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      let response;
      if (roleID === '1' || roleID === '2') {
        response = await api.get('/events/showEventAdmin');
      } else {
        response = await api.get('/events/showEvents');
      }
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = () => {
    navigate('/events/add');
  };

  const handleUpdateEvent = (eventID) => {
    navigate(`/events/update/${eventID}`);
  };

  const handleDeleteEvent = async (eventID) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventID}/deleteEvents`);
        fetchEvents();
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        if (error.response && error.response.status === 409) {
          toast.error('Cannot delete the event. It may be referenced by other data.');
        } else {
          toast.error('Failed to delete event. Please try again.');
        }
      }
    }
  };

  const handleMenuOpen = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEventId(eventId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEventId(null);
  };

  const handleDeleteClick = (eventID) => {
    setEventToDelete(eventID);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    deleteEvent(eventToDelete);
  };

  const deleteEvent = async (eventID) => {
    try {
      await api.delete(`/events/${eventID}/deleteEvents`);
      fetchEvents();
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      if (error.response && error.response.status === 409) {
        toast.error('Cannot delete the event. It may be referenced by other data.');
      } else {
        toast.error('Failed to delete event. Please try again.');
      }
    }
    handleCloseDeleteDialog();
  };

  const handleMenuAction = (action) => {
    if (action === 'update') {
      handleUpdateEvent(selectedEventId);
    } else if (action === 'delete') {
      handleDeleteClick(selectedEventId);
    }
    handleMenuClose();
  };

  // Get current events
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="event-list-container">
      <h1 className="mb-4">Events List</h1>
      {roleID === '2' && (
        <Button onClick={handleAddEvent} className="mb-4 event-button">Add New Event</Button>
      )}
      <CardGroup>
        {currentEvents.map((event) => (
          <Card key={event.eventID} className="mb-4">
            {(roleID === '1' || roleID === '2') && (
              <div className="dropdown-wrapper">
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                  >
                    <MoreVert />
                  </MenuButton>
                  <Menu>
                    {roleID === '2' && (
                      <MenuItem onClick={() => handleMenuAction('update')}>
                        Update
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleMenuAction('delete')}>
                      Delete
                    </MenuItem>
                  </Menu>
                </Dropdown>
                </div>
                )}
            <Card.Img variant="top" src={event.img_url} alt={event.title} />
            <Card.Body>
              <Card.Title>{event.event_name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{event.title}</Card.Subtitle>
              <Card.Text>{event.description}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Start Date: {new Date(event.start_date).toLocaleDateString()}</small>
              <br />
              <small className="text-muted">End Date: {new Date(event.end_date).toLocaleDateString()}</small>
            </Card.Footer>
          </Card>
        ))}
      </CardGroup>
      <div className="pagination">
        {Array.from({ length: Math.ceil(events.length / eventsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
      <Dialog
        open={openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px'
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Box display="flex" alignItems="center" mb={2}>
            <WarningIcon color="warning" style={{ fontSize: 40, marginRight: '16px' }} />
            <Typography variant="h5" component="span" fontWeight="bold">
              Delete Event
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this event? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', mt: 2 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ 
              borderRadius: '20px', 
              px: 3,
              borderColor: 'grey.400',
              color: 'grey.700',
              '&:hover': {
                borderColor: 'grey.600',
                backgroundColor: 'grey.100'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ 
              borderRadius: '20px', 
              px: 3,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            Delete Event
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventList;
