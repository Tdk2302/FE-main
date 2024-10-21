import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import Spinner from "../components/Spinner";
import "../styles/petHealthRecord.scss";
import { toast } from "react-toastify";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const PetHealthRecord = ({ petID }) => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const roleID = localStorage.getItem("roleID");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editedRows, setEditedRows] = useState({});

  useEffect(() => {
    fetchPetHealthRecords();
  }, [petID]);

  const fetchPetHealthRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/petHealth/showPetHealth/${petID}`);
      if (response.data.data) {
        setHealthRecords(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to fetch pet health records");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCellChange = (params) => {
    const { id, field, value } = params;
    setEditedRows((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], [field]: value },
    }));
  };

  const handleEdit = async () => {
    try {
      const updatedRecords = Object.keys(editedRows).map((id) => ({
        recordID: id,
        ...editedRows[id],
      }));

      for (const record of updatedRecords) {
        await axios.put("/petHealth/updateHealth", record);
      }

      toast.success("Records updated successfully");
      fetchPetHealthRecords();
      setEditedRows({});
    } catch (err) {
      toast.error("Failed to update records");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const selectedIds = Object.keys(editedRows);
      for (const id of selectedIds) {
        await axios.delete(`/petHealth/deleteHealth/${id}`);
      }
      toast.success("Records deleted successfully");
      fetchPetHealthRecords();
      setEditedRows({});
    } catch (err) {
      toast.error("Failed to delete records");
      console.error(err);
    }
  };

  const handleAddRecord = async (newRecord) => {
    try {
      await axios.post("/petHealth/addRecord", { ...newRecord, petID });
      toast.success("Record added successfully");
      fetchPetHealthRecords();
      setShowAddForm(false);
    } catch (err) {
      toast.error("Failed to add record");
      console.error(err);
    }
  };

  const columns = [
    {
      field: "veterinarian_name",
      headerName: "Veterinarian",
      width: 150,
      editable: true,
    },
    {
      field: "check_in_date",
      headerName: "Check-in Date",
      width: 150,
      editable: true,
      type: "date",
      valueGetter: (params) => new Date(params.value),
      valueSetter: (params) => ({
        ...params.row,
        check_in_date: params.value.toISOString(),
      }),
    },
    {
      field: "check_out_date",
      headerName: "Check-out Date",
      width: 150,
      editable: true,
      type: "date",
      valueGetter: (params) => new Date(params.value),
      valueSetter: (params) => ({
        ...params.row,
        check_out_date: params.value.toISOString(),
      }),
    },
    {
      field: "illness_name",
      headerName: "Illness",
      width: 150,
      editable: true,
    },
    {
      field: "veterinary_fee",
      headerName: "Veterinary Fee",
      width: 150,
      editable: true,
      type: "number",
      valueFormatter: (params) => `$${params.value}`,
    },
    { field: "note", headerName: "Notes", width: 200, editable: true },
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Error: {error}</div>;
  const AddRecordForm = ({ onSubmit, onCancel }) => {
    const [newRecord, setNewRecord] = useState({
      veterinarian_name: "",
      check_in_date: "",
      check_out_date: "",
      illness_name: "",
      veterinary_fee: "",
      note: "",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewRecord((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(newRecord);
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="veterinarian_name"
          placeholder="Veterinarian Name"
          value={newRecord.veterinarian_name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="check_in_date"
          value={newRecord.check_in_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="check_out_date"
          value={newRecord.check_out_date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="illness_name"
          placeholder="Illness Name"
          value={newRecord.illness_name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="veterinary_fee"
          placeholder="Veterinary Fee"
          value={newRecord.veterinary_fee}
          onChange={handleChange}
          required
        />
        <textarea
          name="note"
          placeholder="Notes"
          value={newRecord.note}
          onChange={handleChange}
        />
        <button type="submit">Add Record</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    );
  };
  return (
    <div className="pet-health-records">
      <h2>Pet Health Records</h2>
      {roleID === "2" && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add New Record
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEdit}
            style={{ marginLeft: "10px" }}
            // disabled={Object.keys(editedRows).length === 0}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            style={{ marginLeft: "10px" }}
            disabled={Object.keys(editedRows).length === 0}
          >
            Delete Selected
          </Button>
        </>
      )}
      {showAddForm && roleID === "2" && (
        <AddRecordForm
          onSubmit={handleAddRecord}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      {healthRecords.length === 0 ? (
        <p>No health records found for this pet.</p>
      ) : roleID === "2" ? (
        <Paper sx={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={healthRecords}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => row.recordID}
            onEditCellChangeCommitted={handleEditCellChange}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Paper>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Veterinarian</TableCell>
                <TableCell align="right">Check-in Date</TableCell>
                <TableCell align="right">Check-out Date</TableCell>
                <TableCell align="right">Illness</TableCell>
                <TableCell align="right">Veterinary Fee</TableCell>
                <TableCell align="right">Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {healthRecords.map((row) => (
                <TableRow
                  key={row.recordID}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.veterinarian_name}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(row.check_in_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(row.check_out_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">{row.illness_name}</TableCell>
                  <TableCell align="right">${row.veterinary_fee}</TableCell>
                  <TableCell align="right">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default PetHealthRecord;
