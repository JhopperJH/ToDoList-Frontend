import React from "react";
import { slide as Menu } from "react-burger-menu";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <Menu>
      <a className="menu-item" href="/main">
        Menu
      </a>
      <a className="menu-item" href="/credit">
        Credit
      </a>
      <a
        className="menu-item"
        href="#"
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          navigate("/signout"); // Navigate to the sign-out page
        }}
      >
        Sign out
      </a>
    </Menu>
  );
};

export default SideBar;