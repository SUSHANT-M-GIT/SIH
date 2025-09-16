import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './Context/ContextProvider';
import Login from './Components/Login';
import CreateUser from './Components/CreateUser';
import Dashboard from './Components/Dashboard';
import CreateComplaint from './Components/CreateComplaint';
import ComplaintDetail from './Components/ComplaintDetail';
import './App.css';

function App() {
  const context = useContext(UserContext);
  const useremail = context?.useremail || '';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/createuser" element={<CreateUser />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={useremail ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/create-complaint" 
        element={useremail ? <CreateComplaint /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/complaint/:complaintId" 
        element={useremail ? <ComplaintDetail /> : <Navigate to="/login" />} 
      />
      
      {/* Default redirect */}
      <Route 
        path="/" 
        element={<Navigate to={useremail ? "/dashboard" : "/login"} />} 
      />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;