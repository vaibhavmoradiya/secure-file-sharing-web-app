import React from "react";

function Modal({ message, type, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{type === "success" ? "Success!" : "Error"}</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
