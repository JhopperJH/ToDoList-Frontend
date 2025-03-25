import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th"; // Import Thai locale
import moment from "moment-timezone";
import "moment/locale/th";
import "./MainPage.css";
import SideBar from "../components/Sidebar";

const MainPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    deadline: null, // Use null for the initial date value
    description: "",
  });
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const toastShown = useRef(false);
  registerLocale("th", th);

  useEffect(() => {
    const token = Cookies.get("authToken");

    // If no token or token is expired, navigate to login immediately
    if (!token || isTokenExpired(token)) {
      if (!toastShown.current) {
        toast.error("You are not logged in!");
        toastShown.current = true;
      }
      navigate("/login");
      return; // Exit early to prevent further execution
    }

    // Fetch todos if the token is valid
    fetchTodos();
    const interval = setInterval(fetchTodos, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const isTokenExpired = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error parsing token:", error);
      return true;
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5555/Activities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      if (error.response?.status === 401) {
        // Unauthorized (token expired or invalid)
        toast.error("Your session has expired.\n Please log in again.");
        Cookies.remove("authToken"); // Remove the invalid token
        navigate("/signout"); // Redirect to login
      } else {
        setError("Failed to fetch todos.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    const adjustedDate = moment(date).tz("Asia/Bangkok").toDate();
    setFormData({ ...formData, deadline: adjustedDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formattedDeadline = moment(formData.deadline)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"); // Convert to ISO string in Thai timezone
      const requestData = {
        ...formData,
        deadline: formattedDeadline,
      };
      await axios.post("http://localhost:5555/Activities", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Todo added successfully!");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to add todo.");
      setError("Failed to add todo. Please try again.");
    }
  };

  const handleToggle = async (id) => {
    setError("");

    try {
      await axios.put(
        `http://localhost:5555/Activities/${id}/confirm`,
        {}, // Empty body since you're only toggling the status
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Todo updated successfully!");
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to update complete status."
      );
      setError("Failed to complete status.");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await axios.delete(`http://localhost:5555/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Todo deleted successfully!");
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to delete todo.");
      setError("Failed to delete todo.");
    }
  };

  return (
    <div>
      <SideBar />
      <div className="main-bg">
        <div className="main-container">
          <h1 className="title">TO-DO LIST</h1>
          <form className="main-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                className="name-input"
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <DatePicker
                selected={formData.deadline}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat={`dd MMM ${
                  moment(formData.deadline).year() + 543
                } HH:mm`}
                locale="th"
                timeCaption="เวลา"
                placeholderText="Due Date"
                className="date-picker"
                required
                portalId="root"
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <button type="submit">Add</button>
            </div>
          </form>
          <div className="todo-list">
            {todos.length > 0 ? (
              todos.map((todo, index) => (
                <Card
                  key={index}
                  className={`todo-item ${todo.confirmed ? "confirmed" : ""}`}
                  sx={{ mb: 2, p: 0 }}
                >
                  <CardContent style={{ padding: "12px" }}>
                    <Grid
                      container
                      spacing={2}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Grid item md={1} xs={2}>
                        <Checkbox
                          icon={<CheckCircleOutlineIcon />}
                          checkedIcon={<CheckCircleIcon />}
                          checked={todo.confirmed}
                          onChange={() => handleToggle(todo.id)}
                        />
                      </Grid>
                      <Grid item md={7} xs={10} style={{ textAlign: "left" }}>
                        <Typography
                          variant="h6"
                          component="div"
                          className={todo.confirmed ? "text-crossed" : ""}
                        >
                          {todo.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className={todo.confirmed ? "text-crossed" : ""}
                        >
                          {todo.description}
                        </Typography>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Due:{" "}
                          {new Date(todo.deadline).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          {new Date(todo.deadline).toLocaleTimeString("th-TH", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false,
                            timeZone: "Asia/Bangkok",
                          })}
                        </Typography>
                      </Grid>
                      <Grid item md={1} xs={6} style={{ alignItems: "center" }}>
                        <IconButton aria-label="edit">
                          <EditIcon
                            onClick={() => navigate(`/activities/${todo.id}`)}
                          />
                        </IconButton>
                      </Grid>
                      <Grid item md={1} xs={6}>
                        <IconButton aria-label="delete">
                          <DeleteIcon onClick={() => handleDelete(todo.id)} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No todos available.</p>
            )}
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
