import React, { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { patients, doctors, appointments } = useData();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboardss</h1>
      <p className="mb-4">Role: {user.role}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Patients</h2>
          <p className="text-3xl">{patients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Doctors</h2>
          <p className="text-3xl">{doctors.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Appointments</h2>
          <p className="text-3xl">{appointments.length}</p>
        </div>
      </div>
      {user.role === 'admin' && (
        <div className="mt-6 bg-yellow-100 p-4 rounded">
          <p>Admin: Full access to manage all data.</p>
        </div>
      )}
      {user.role === 'staff' && (
        <div className="mt-6 bg-blue-100 p-4 rounded">
          <p>Staff: View and book appointments.</p>
        </div>
      )}
    </div>
  );
};


export default Dashboard;
