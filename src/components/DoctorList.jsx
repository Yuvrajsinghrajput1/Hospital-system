import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const DoctorList = () => {
  const { user } = useAuth();
  const { doctors, departments, addDoctor, updateDoctor, deleteDoctor } = useData();
  const [formData, setFormData] = useState({ name: '', specialty: '', department: '', contact: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.specialty || !formData.department || !formData.contact) {
      setError('All fields are required.');
      return;
    }
    if (editingId) {
      updateDoctor(editingId, formData);
    } else {
      addDoctor(formData);
    }
    setFormData({ name: '', specialty: '', department: '', contact: '' });
    setEditingId(null);
    setError('');
  };

  const handleEdit = (doctor) => {
    if (user.role !== 'admin') {
      setError('Only admins can edit doctors.');
      return;
    }
    setFormData(doctor);
    setEditingId(doctor.id);
  };

  const handleDelete = (id) => {
    if (user.role !== 'admin') {
      setError('Only admins can delete doctors.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteDoctor(id);
      setError('');
    }
  };

  const isAdmin = user.role === 'admin';

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Doctor List</h1>
      <p className="mb-4">
        Role: {user.role} - {isAdmin ? 'Full access (CRUD)' : 'View only'}
      </p>

      {/* Form for Adding/Editing Doctors (Admin Only) */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Doctor Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 border rounded"
              required
            />

            <input
              type="text"
              placeholder="Specialty"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="p-3 border rounded"
              required
            />

            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="p-3 border rounded"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="p-3 border rounded"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 md:col-span-2"
            >
              {editingId ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </form>
        </div>
      )}

      {!isAdmin && (
        <div className="bg-yellow-100 p-4 rounded mb-6">
          <p className="text-yellow-800">Staff role: You can view doctors but cannot add, edit, or delete. Contact admin for changes.</p>
        </div>
      )}

      {/* List of Doctors */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Doctors List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{doctor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doctor.specialty}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doctor.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doctor.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {doctors.length === 0 && (
          <p className="p-4 text-gray-500 text-center">No doctors registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorList;