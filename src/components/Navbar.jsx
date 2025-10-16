import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-xl font-bold">Hospital Management</Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="text-white hover:underline">Dashboard</Link>
          <Link to="/patients" className="text-white hover:underline">Patients</Link>
          <Link to="/appointments" className="text-white hover:underline">Appointments</Link>
          <Link to="/doctors" className="text-white hover:underline">Doctors</Link>
          <span className="text-white">Welcome, {user.username} ({user.role})</span>
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;