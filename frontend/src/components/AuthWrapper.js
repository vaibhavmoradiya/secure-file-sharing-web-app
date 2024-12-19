import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          // Token is valid, stay on the page
          navigate("/")
        } else {
          // Token expired, clear and redirect
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      // No token found, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  // Render the children (Dashboard or any other page wrapped by AuthWrapper)
  return <>{children}</>;
};

export default AuthWrapper;
