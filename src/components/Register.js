import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.scss";
const Register = () => {
  const [fullName, setFullName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const isFormValid =
    fullName &&
    birthday &&
    sex &&
    address &&
    phoneNumber &&
    username &&
    password &&
    confirmPassword &&
    role &&
    password === confirmPassword;

  const handleGoBack = () => {
    navigate("/");
  };

  const handleRegister = () => {
    if (isFormValid) {
      const userData = {
        fullName,
        birthday,
        sex,
        address,
        phoneNumber,
        username,
        password,
      };
      console.log("Registering user:", userData);
    }
  };

  return (
    <>
      <div className="register-container col-12 col-sm-6 mx-auto">
        <div className="title">Register</div>

        <div className="title-text">Enter Your Information:</div>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="form-control mb-3"
        />

        <input
          type="date"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
          className="form-control mb-3"
        />

        <select
          className="form-select mb-3"
          value={sex}
          onChange={(event) => setSex(event.target.value)}
        >
          <option value="" disabled hidden>
            Select Sex
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="form-control mb-3"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          className="form-control mb-3"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="form-control mb-3"
        />

        <div className="input-password mb-3">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-control"
          />
          <i
            className={
              isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowPassword(!isShowPassword)}
          ></i>
        </div>

        <div className="input-password mb-3">
          <input
            type={isShowConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="form-control"
          />
          <i
            className={
              isShowConfirmPassword
                ? "fa-solid fa-eye"
                : "fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
          ></i>
        </div>
        <select
          className="form-select mb-3"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="" disabled hidden>
            Select Role
          </option>
          <option value="Staff">Staff</option>
          <option value="Member">Member</option>
        </select>
        <button
          className={`button btn btn-primary w-100 ${
            isFormValid ? "active" : ""
          }`}
          disabled={!isFormValid}
          onClick={handleRegister}
        >
          Register
        </button>

        <div className="back mt-3" onClick={handleGoBack}>
          <i className="fa-solid fa-angles-left"></i> Go back
        </div>
      </div>
    </>
  );
};

export default Register;
