import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage'; // Add your LoginPage component
import RegisterPage from './pages/RegisterPage'; // Add your RegisterPage component
import AuthWrapper from "./components/AuthWrapper";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <AuthWrapper> */}
          <Routes>
          <Route path="/" element={<AuthWrapper><Dashboard /></AuthWrapper>} />
            <Route path="/login" element={<AuthWrapper><LoginPage /></AuthWrapper>} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        {/* </AuthWrapper> */}
      </div>
    </Router>
  );
}

export default App;
