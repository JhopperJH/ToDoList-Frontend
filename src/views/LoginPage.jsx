import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./LoginPage.css";

const LoginPage = () => {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5555/Tokens", {
        nationalId: nationalId,
        password: password,
      });
      const token = response.data.token; // Get token from response

      if (token) {
        Cookies.set("authToken", token, {
          expires: 1, // Set token expiry to 30 minutes
        });
        toast.success("Login successful!");
        navigate("/main"); // Redirect to main page
      } else {
        toast.error("Invalid login response. No token received.");
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="background-image">
      <div className="container">
        <p className="quote">It always seems impossible until it’s done</p>
        <h3 className="title">TO-DO LIST</h3>
        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <label>National ID:</label>
            <input
              type="text"
              placeholder="National ID"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
            />
            <label>Password:</label>
            <FormControl
              variant="outlined"
              fullWidth
              className="custom-password"
            >
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: "5px",
                  "& fieldset": { borderColor: "#666" },
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ color: "#fff" }}
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <button type="submit">Sign in</button>
            {error && <p className="error-message">{error}</p>}
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
