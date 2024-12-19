import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setError] = useState("");
  const [, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // 'success' or 'error'
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Input validation
    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match.");
      setModalType("error");
      setShowModal(true);
      return;
    }

    if (!email || !username || !password) {
      setModalMessage("All fields are required.");
      setModalType("error");
      setShowModal(true);
      return;
    }

    try {
      // Dispatch the register action
      const response = await dispatch(register({ username, email, password }));

      // Check if the response has error
      if (response.error) {
        // If user already exists or any other error, display error message
        console.log("Error: ", response.error.message); // Debugging
        setModalMessage(response.error.message);
        setModalType("error");
        setShowModal(true);
      } else {
        // If successful, display success message and navigate to login
        setModalMessage("Registration successful! Redirecting to login...");
        setModalType("success");
        setShowModal(true);

        // Wait a moment before redirecting to show success message
        setTimeout(() => {
          navigate("/login");
        }, 2000); // 2 seconds delay to view success message
      }
    } catch (err) {
      setModalMessage("Registration failed. Please try again.");
      setModalType("error");
      setShowModal(true);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />
        <button type="submit">Register</button>
      </form>

      {/* Show Modal on Success/Error */}
      {showModal && (
        <Modal
          message={modalMessage}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default RegisterPage;
