import React, { useState, useEffect } from "react"; // Added useEffect for fetching donators
import axios from "axios";
import { BASE_URL } from "../services/axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PageTitle from "../components/PageTitle"; // Import the new component
import "../styles/donate.scss"; // Import the new SCSS file
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

const Donate = () => {
  const [donations, setDonation] = useState([]);
  const [donators, setDonators] = useState([]); // State for donators
  const api_donate =
    "https://script.google.com/macros/s/AKfycbyQxSQp5kQd_tzarGa2l61fY2BKAVqC3jIhEhaqGOHOhraucs1P3c87XX4dsAqKRNjUvg/exec";
  const accountID = sessionStorage.getItem("accountID");
  const evenID = localStorage.getItem("evenID");
  let content = ``;

  if (accountID != null && evenID != null) {
    content = `Account ${accountID} donate event ${evenID}`;
    localStorage.removeItem("evenID");
  } else if (accountID != null && evenID == null) {
    content = `Account ${accountID} donate FurryFriendFund`;
  } else if (accountID == null && evenID != null) {
    content = `Donate event ${evenID}`;
  } else {
    content = `Donate FurryFriendFund`;
  }

  const imageURL = `https://api.vietqr.io/image/970422-1319102004913-wjc5eta.jpg?accountName=TRUONG%20PHUC%20LOC&amount=0&addInfo=${content.replaceAll(" ","%20")}`;

  // Fetch donators on component mount
  useEffect(() => {
    const fetchDonators = async () => {
      const response = await axios.get(`${BASE_URL}accounts/showDonators`);
      setDonators(response.data.data); // Assuming the response structure
    };
    fetchDonators();
  }, []);

  const getDonate = async () => {
    const donateData = await axios.get(api_donate);
    let donates = donateData.data.data;
    setDonation(donates);
  };

  const addDonation = async (donation) => {
    try {
      const response = await axios.post(`${BASE_URL}donation/add`, {
        donateID: donation.id,
        date_time: donation.date_time.replace(" ", "T") + "Z",
        note: donation.content,
        amount: donation.amount,
      });
      console.log(response.data.message);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const addAll = async () => {
    for (let donation of donations) {
      await addDonation(donation);
    }
  };

  const handleAddDonate = async () => {
    toast.success(
      `We will check transaction history. If you had donated, please check your total donation after a few seconds`
    );
    await getDonate();
    await addAll();
  };

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="donate-container">
      <div className="row">
        <div className="col-sm-8 col-md-8 col-lg-8 donation-notes">
          <h2>I Want to Support</h2>
          <p>
            All activities of the FurryFriendFund group are entirely based on
            community contributions. The monthly expenses of the group include
            rent, utilities, food, water, medicine, and supplies to support the
            beautiful pets in our care. The group greatly appreciates your
            support to maintain our shelter. A contribution of 50,000 to 100,000
            VND per month can significantly help our group and the animals in
            need.
          </p>
          <p>
            All expenses will be equally distributed among the animals and the
            construction of the shared shelter. Additionally, the group will
            continue to receive donations in the form of used items (like old
            clothes), food, medical supplies, and more.
          </p>
          <p>
            *Note: The group does not use Zalo to request information such as
            OTP or other sensitive details.
          </p>

          <h4>Scan the QR code above and check the information:</h4>
          <h6>Bank: MB Bank</h6>
          <h6>Account Number: 1319102004913</h6>
          <h6>Account Name: TRUONG PHUC LOC</h6>
          <h6>Content: {content}</h6>
          <h6>
            After a successful donation, click
            <Button className="edit-button" onClick={handleAddDonate}>
              Here
            </Button>{" "}
            to check the transaction history and save your donation.
          </h6>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      <h1>Donators</h1>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <h2>Name</h2>
                    </TableCell>
                    <TableCell align="right">
                      <h2>Total Donation</h2>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donators
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((donator) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={donator.id}
                      >
                        <TableCell>{donator.name}</TableCell>
                        <TableCell align="right">
                          ${donator.total_donation}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={donators.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        <div className="col-sm-4 col-md-4 col-lg-4 res-margin donate-image">
          <img
            src={imageURL}
            alt="Sample"
            style={{ width: "300px", height: "300px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Donate;
