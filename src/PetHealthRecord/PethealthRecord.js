import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import Spinner from "../components/Spinner";
import "../styles/petHealthRecord.scss";
import { toast } from "react-toastify";

const PetHealthRecord = ({ petID }) => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const roleID = localStorage.getItem("roleID");
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    veterinarian_name: "",
    check_in_date: "",
    check_out_date: "",
    illness_name: "",
    veterinary_fee: "",
    note: "",
  });

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

  const handleEdit = (recordID) => {
    setEditingId(recordID);
  };

  const handleSave = async (record) => {
    try {
      const response = await axios.put("/petHealth/updateHealth", record);
      if (response.data.data) {
        fetchPetHealthRecords();
        setEditingId(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      setError("Failed to update health record");
      console.error(err);
    }
  };

  const handleDelete = async (recordID) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await axios.delete(
          `/petHealth/deleteHealth/${recordID}`
        );
        if (response.data.data) {
          fetchPetHealthRecords();
          toast.success(response.data.message);
        } else {
          setError(response.data.message);
          toast.error(response.data.message);
        }
      } catch (err) {
        setError("Failed to delete health record");
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (e, record) => {
    const { name, value } = e.target;
    const updatedRecords = healthRecords.map((r) =>
      r.recordID === record.recordID ? { ...r, [name]: value } : r
    );
    setHealthRecords(updatedRecords);
  };

  const handleNewRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/petHealth/addRecord", {
        ...newRecord,
        petID,
      });
      if (response.data.data) {
        fetchPetHealthRecords();
        setShowAddForm(false);
        setNewRecord({
          veterinarian_name: "",
          check_in_date: "",
          check_out_date: "",
          illness_name: "",
          veterinary_fee: "",
          note: "",
        });
        toast.success(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to add health record");
      console.error(err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="pet-health-records">
      <h2>Pet Health Records</h2>
      <button
        className="add-record-btn"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Cancel" : "Add New Record"}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddRecord} className="add-record-form">
          <input
            type="text"
            name="veterinarian_name"
            placeholder="Veterinarian Name"
            value={newRecord.veterinarian_name}
            onChange={handleNewRecordChange}
            required
          />
          <input
            type="date"
            name="check_in_date"
            value={newRecord.check_in_date}
            onChange={handleNewRecordChange}
            required
          />
          <input
            type="date"
            name="check_out_date"
            value={newRecord.check_out_date}
            onChange={handleNewRecordChange}
            required
          />
          <input
            type="text"
            name="illness_name"
            placeholder="Illness"
            value={newRecord.illness_name}
            onChange={handleNewRecordChange}
            required
          />
          <input
            type="number"
            name="veterinary_fee"
            placeholder="Veterinary Fee"
            value={newRecord.veterinary_fee}
            onChange={handleNewRecordChange}
            required
          />
          <textarea
            name="note"
            placeholder="Notes"
            value={newRecord.note}
            onChange={handleNewRecordChange}
          />
          <button type="submit">Add Record</button>
        </form>
      )}

      {healthRecords.length === 0 ? (
        <p>No health records found for this pet.</p>
      ) : (
        <table className="health-record-table">
          <thead>
            <tr>
              <th>Veterinarian</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th>Illness</th>
              <th>Veterinary Fee</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {healthRecords.map((record) => (
              <tr key={record.recordID}>
                <td>
                  {editingId === record.recordID ? (
                    <input
                      type="text"
                      name="veterinarian_name"
                      value={record.veterinarian_name}
                      onChange={(e) => handleChange(e, record)}
                    />
                  ) : (
                    record.veterinarian_name
                  )}
                </td>
                <td>
                  {editingId === record.recordID ? (
                    <input
                      type="date"
                      name="check_in_date"
                      value={record.check_in_date.split("T")[0]}
                      onChange={(e) => handleChange(e, record)}
                    />
                  ) : (
                    new Date(record.check_in_date).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editingId === record.recordID ? (
                    <input
                      type="date"
                      name="check_out_date"
                      value={record.check_out_date.split("T")[0]}
                      onChange={(e) => handleChange(e, record)}
                    />
                  ) : (
                    new Date(record.check_out_date).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editingId === record.recordID ? (
                    <input
                      type="text"
                      name="illness_name"
                      value={record.illness_name}
                      onChange={(e) => handleChange(e, record)}
                    />
                  ) : (
                    record.illness_name
                  )}
                </td>
                <td>
                  {editingId === record.recordID ? (
                    <input
                      type="number"
                      name="veterinary_fee"
                      value={record.veterinary_fee}
                      onChange={(e) => handleChange(e, record)}
                    />
                  ) : (
                    `$${record.veterinary_fee}`
                  )}
                </td>
                <td>
                  {editingId === record.recordID ? (
                    <textarea
                      name="note"
                      value={record.note}
                      onChange={(e) => handleChange(e, record)}
                    />
                  ) : (
                    record.note
                  )}
                </td>
                {roleID === 2 && (
                  <td>
                    {editingId === record.recordID ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => handleSave(record)}
                        >
                          Save
                        </button>
                        <button className="cancel-btn" onClick={handleCancel}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(record.recordID)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(record.recordID)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PetHealthRecord;
