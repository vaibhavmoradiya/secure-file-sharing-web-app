// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import FileUpload from "../components/FileUpload";
// import ShareFile from "../components/ShareFile";
// import { fetchFiles } from "../store/fileSlice";
// import { logout } from "../store/authSlice"; // Import the logout action

// function Dashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const files = useSelector((state) => state.files.files);
//   const token = useSelector((state) => state.auth.token);

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchFiles(token));
//     }
//   }, [dispatch, token]);

//   const downloadFile = async (fileId) => {
//     // TODO: Add logic to download the file
//     console.log("Download file with id:", fileId);
//   };

//   const handleLogout = () => {
//     dispatch(logout()); // Dispatch logout action
//     navigate("/login"); // Navigate to login page after logout
//   };

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       <FileUpload />

//       <button onClick={handleLogout}>Logout</button> {/* Logout button */}

//       {files.map((file) => (
//         <div key={file.id}>
//           <h3>File Name: {file.file_name}</h3>
//           <ShareFile fileId={file.id} />
//           <button onClick={() => downloadFile(file.id)}>Download</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Dashboard;


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import ShareFile from "../components/ShareFile";
import { fetchFiles, fetchSharedFiles } from "../store/fileSlice";
import { logout } from "../store/authSlice"; // Import the logout action

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const files = useSelector((state) => state.files.files); // Owned files
  const sharedFiles = useSelector((state) => state.files.sharedFiles); // Shared files
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchFiles(token)); // Fetch files owned by the user
      dispatch(fetchSharedFiles(token)); // Fetch files shared with the user
    }
  }, [dispatch, token]);

  const downloadFile = (fileId) => {
    console.log("Downloading file with ID:", fileId);
    // You can add the actual download logic here
  };

  const viewFile = (link) => {
    window.open(`http://localhost:8000/api/shares/${link}`, "_blank");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <FileUpload />
      <button onClick={handleLogout}>Logout</button>

      <h3>Owned Files</h3>
      {files && files.length > 0 ? (
        files.map((file) => (
          <div key={file.id}>
            <h4>{file.file_name}</h4>
            <ShareFile fileId={file.id} />
            <button onClick={() => downloadFile(file.id)}>Download</button>
          </div>
        ))
      ) : (
        <p>No files owned by you.</p>
      )}

      <h3>Shared Files</h3>
      {sharedFiles && sharedFiles.length > 0 ? (
        Array.from(
            new Map(sharedFiles.map((sharedFile) => [sharedFile.file, sharedFile])).values()
        ).map((sharedFile) => (
            <div key={sharedFile.id}>
            <h4>{sharedFile.file_name}</h4>
            {sharedFile.permission === "view" ? (
                <button onClick={() => viewFile(sharedFile.share_link)}>View</button>
            ) : (
                <button onClick={() => downloadFile(sharedFile.id)}>Download</button>
            )}
            </div>
        ))
        ) : (
        <p>No files shared with you.</p>
        )}

    </div>
  );
}

export default Dashboard;
