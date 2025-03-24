import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nationalId: "",
    title: "",
    firstName: "",
    lastName: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.nationalId.length !== 13) {
      setError("National ID must be 13 characters long!");
      return;
    }

    // Simple validation
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5555/Users",
        formData
      );
      console.log("User registered:", response.data);
      toast.success("Register successful");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 409){
        toast.error("National ID already registered.");
        return;
      } else {
        toast.error(err.message);
        setError("Register failed");
        console.error("Login Error:", err);
      }
    }
  };

  return (
    <div className="background">
      <div className="register-container">
        <h1 className="title">TO-DO LIST</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <label>National ID:</label>
          <input
            type="text"
            name="nationalId"
            placeholder="National ID"
            value={formData.nationalId}
            onChange={handleChange}
            required
          />

          <div className="label-container">
            <label>Title:</label>
            <label>First Name:</label>
          </div>
          <div className="name-container">
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            >
              <option value="">Title</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
            </select>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <label>Password:</label>
          <FormControl variant="outlined" fullWidth className="custom-password">
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          <label>Confirm Password:</label>
          <FormControl variant="outlined" fullWidth className="custom-password">
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              placeholder="Confirmed Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
