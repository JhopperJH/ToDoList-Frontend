import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const [, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    removeCookie("token", { path: "/" }); // Remove the token cookie
    setTimeout(() => {
      navigate("/login"); // Navigate to the login page after 3 seconds
    }, 2000);
  }, [removeCookie, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <img
        src="/images/loading.gif"
        alt="Signing Out"
        style={{ width: "250px", height: "250px", marginBottom: "20px" }}
      />
      <h1>Signing Out...</h1>
    </div>
  );
};

export default SignOut;