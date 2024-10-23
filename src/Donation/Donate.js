import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../services/axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PageTitle from "../components/PageTitle"; // Import the new component

const Donate = () => {
  const [donations, setDonation] = useState([]);
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
  const imageURL = `https://api.vietqr.io/image/970422-1319102004913-wjc5eta.jpg?accountName=TRUONG%20PHUC%20LOC&amount=0&addInfo=${content}`;

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
      `We will check transaction history. If you had donated, please check your total donation after a few second`
    );
    await getDonate();
    await addAll();
  };

  return (
    <div>
      {/* <PageTitle title="QR Donation" /> Add the PageTitle component */}
      <img
        src={imageURL}
        alt="Sample"
        style={{ width: "500px", height: "400px" }}
      />
      <h4>Scan the QR code above and check the information:</h4>
      <h6>Bank: MB Bank</h6>
      <h6>Account Number: 1319102004913</h6>
      <h6>Account Name: TRUONG PHUC LOC</h6>
      <h6>Content: {content}</h6>
      <h6>
        After a successful donation, please wait a moment and click{" "}
        <Button className="edit-button" onClick={handleAddDonate}>
          Here
        </Button>
        <br /> The system will check the transaction history and save your
        donation.
      </h6>
      <h1>Thank you for your support!</h1>
    </div>
  );
};

export default Donate;
