import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../store/fileSlice";
import { encryptData } from "../utils/crypto";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !fileName) {
      alert("Please select a file and enter a file name.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const encryptedFileContent = await encryptData(e.target.result);
      const formData = new FormData();
      formData.append("file_content", new Blob([encryptedFileContent]), file.name);
      formData.append("file_name", fileName);
      
      try {
        await dispatch(uploadFile({ formData, token })).unwrap();  // Use unwrap to handle the success/failure explicitly
        setSuccessMessage("File uploaded successfully!");
      } catch (error) {
        // Log the error and show it in the success message
        console.error("Upload error:", error);
        setSuccessMessage(`Error uploading file: ${error.message || error}`);
      }  

    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h3>Upload a File</h3>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="File Name"
        value={fileName}
        onChange={handleFileNameChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {/* Display the success or error message */}
      {successMessage && <div>{successMessage}</div>}
    </div>
  );
}

export default FileUpload;
