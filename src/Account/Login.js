import "@fortawesome/fontawesome-free/css/all.min.css";
import { jwtDecode } from 'jwt-decode'; // Sử dụng named import
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import api from "../services/axios";
import "../styles/login.scss";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleID = localStorage.getItem("roleID");
    if (token && roleID) {
      console.log("Token found in localStorage:", token);
      console.log("RoleID found in localStorage:", roleID);
      if (roleID === "1" || roleID === 1) {
        navigate("/petlistadmin", { replace: true });
      } else if (roleID === "2" || roleID === 2) {
        navigate("/appointment", { replace: true });
      } else {
        navigate("/", { replace: true });
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
        const decodedToken = jwtDecode(response.data.jwt);
        const role = decodedToken.roles[0];
        localStorage.setItem("roleID", role);
        toast.success("Đăng nhập thành công!");
        
        console.log("Role:", role); // Thêm log để kiểm tra
        
        if (role === "1" || role === 1) {
          console.log("Redirecting to /petlistadmin");
          navigate("/petlistadmin", { replace: true });
        } else if (role === "2" || role === 2) {
          console.log("Redirecting to /appointment");
          navigate("/appointment", { replace: true });
        } else {
          console.log("Redirecting to /");
          navigate("/", { replace: true });
        }
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