import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";
import moment from "moment-timezone";
import "moment/locale/th";
import "./EditPage.css";
import SideBar from "../components/Sidebar";

const EditPage = () => {
  const { id } = useParams(); // Get the todo ID from the URL
  const navigate = useNavigate();
  const token = Cookies.get("authToken");

  const [formData, setFormData] = useState({
    name: "",
    deadline: "",
    description: "",
  });
  const [error, setError] = useState("");
  const toastShown = useRef(false);

  registerLocale("th", th);

  // Check token every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!token || isTokenExpired(token)) {
        toast.error("Your token has expired");
        Cookies.remove("authToken"); // Remove the token
        navigate("/signout"); // Redirect to sign out
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [token, navigate]);

  // Fetch todo data when the component mounts
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
          if (!toastShown.current) {
            toast.error("You are not logged in!");
            toastShown.current = true;
          }
          navigate("/login");
          return; // Exit early to prevent further execution
        }

    fetchTodo(id);
  }, [id, token, navigate]);

  const isTokenExpired = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error parsing token:", error);
      return true;
    }
  };

  const fetchTodo = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5555/Activities/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const todo = response.data;
      setFormData({
        name: todo.name,
        deadline: new Date(todo.deadline),
        description: todo.description,
      });
    } catch (error) {
      console.error("Error fetching todo:", error);
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        Cookies.remove("authToken");
        navigate("/signout");
      } else {
        setError("Failed to fetch todo.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, deadline: date });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formattedDeadline = moment(formData.deadline)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      await axios.put(
        `http://localhost:5555/Activities/${id}`,
        { ...formData, deadline: formattedDeadline },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Todo edited successfully!");
      navigate("/main");
    } catch (error) {
      console.error("Error editing todo:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to edit todo.");
      setError("Failed to edit todo. Please try again.");
    }
  };

  return (
    <div>
      <SideBar />
      <div className="main-bg">
        <div className="main-container">
          <h1 className="title">To-Do LIST</h1>
          <form className="main-form" onSubmit={handleEdit}>
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
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <button type="submit">Save</button>
            </div>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditPage;