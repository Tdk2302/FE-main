import React, { useState, useEffect } from "react";
import "../styles/login.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../services/axios";
import Spinner from "../components/Spinner";
import { jwtDecode } from 'jwt-decode'; // Correct import

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect executed"); // Check if useEffect is running
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Check if token is retrieved
  
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // Check the decoded token
        const roles = decodedToken.roles;
        console.log("User roles:", roles); // Check the roles
        if (roles === "1") {
          navigate("/petlistadmin");
        } else if (roles === "2") {
          navigate("/appointment");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        // localStorage.removeItem("token");
        toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      }
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("accounts/login", {
        accountID: username,
        password,
      });
      if (response && response.data && response.data.jwt) {
        localStorage.setItem("token", response.data.jwt);
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.response || error);
      toast.error(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="login-container col-12 col-sm-4">
      <form onSubmit={handleLogin}>
        <div className="title">Login</div>
        <div className="input-username">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="input-password">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <i
            className={
              isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowPassword(!isShowPassword)}
          ></i>
        </div>

        <button
          className={`button ${username && password ? "active" : ""}`}
          disabled={!username || !password}
        >
          Login
        </button>

        <div className="action-links">
          <div className="back" onClick={handleGoBack}>
            <i className="fa-solid fa-angles-left"></i>
            <span>Go back</span>
          </div>
          <div className="register">
            <p> Don't have an account?</p>
            <NavLink to="/register" className="register-link">
              Register
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;