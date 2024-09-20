import "../styles/login.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useEffect, useState } from "react";
import { loginApi } from "../services/UserServices";
import { toast } from "react-toastify";
import { useNavigate, NavLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    // event.preventDefault(); // Ngăn form reload trang
    if (!email || !password) {
      toast.success("Email/Password is required!");
      return;
    }
  };
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  let res = loginApi(email, password);
  if (res && res.token) {
    localStorage.setItem("token", res.token);
  }
  console.log("check login: ", res);

  const handleGoBack = () => {
    navigate("/");
  };
  return (
    <>
      <div className="login-container col-12 col-sm-4 ">
        <form onSubmit={handleLogin}>
          <div className="title">Login</div>
          <div className="text">Email or UserName</div>
          <input
            type="text"
            placeholder="Email or UserName..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <div className="input-password">
            <input
              type={isShowPassword === true ? "text" : "password"}
              placeholder="Password..."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <i
              className={
                isShowPassword === true
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
              onClick={() => setIsShowPassword(!isShowPassword)}
            ></i>
          </div>

          <button
            className={`button ${email && password ? "active" : ""}`}
            disabled={email && password ? false : true}
          >
            Login
          </button>

          <div className="back" onClick={handleGoBack}>
            <i className="fa-solid fa-angles-left">Go back</i>
            <p>You do not have account?</p>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
