import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shareFile } from "../store/fileSlice";

function ShareFile({ fileId }) {
  const [sharedWith, setSharedWith] = useState("");
  const [permission, setPermission] = useState("view");
  const [expiryDays, setExpiryDays] = useState(1);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleShare = async () => {
    if (!sharedWith) {
      alert("Please enter a user ID to share with.");
      return;
    }
    try {
        // Dispatch shareFile action
        await dispatch(shareFile({ fileId, sharedWith, permission, expiryDays, token })).unwrap();
        // If successful, show success message
        setMessage("File shared successfully!");
      } catch (error) {
        // If an error occurs, show error message
        console.error("Error sharing file:", error);
        setMessage(`Error sharing file: ${error.message || error}`);
      }
  
    // dispatch(shareFile({ fileId, sharedWith, permission, expiryDays, token }));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="User ID to share with"
        value={sharedWith}
        onChange={(e) => setSharedWith(e.target.value)}
      />
      <select
        value={permission}
        onChange={(e) => setPermission(e.target.value)}
      >
        <option value="view">View</option>
        <option value="download">Download</option>
      </select>
      <input
        type="number"
        placeholder="Days to Expiry"
        value={expiryDays}
        onChange={(e) => setExpiryDays(e.target.value)}
      />
      <button onClick={handleShare}>Share</button>
      {/* Display success or error message */}
      {message && <div>{message}</div>}
    </div>
  );
}

export default ShareFile;
