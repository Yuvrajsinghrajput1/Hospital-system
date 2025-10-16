import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const AppointmentBooking = () => {
  const { user } = useAuth();
  const { patients, doctors, appointments, addPatient, addAppointment, updateAppointment, deleteAppointment, getPatient, getDoctor } = useData();

  const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: '', time: '', status: 'Scheduled' });
  const [newPatientData, setNewPatientData] = useState({ name: '', age: '', department: '', contact: '' });
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const getPatientName = (patientId) => {
    const patient = getPatient(patientId);
    return patient ? patient.name : 'Unknown';
  };

  const getDoctorName = (doctorId) => {
    const doctor = getDoctor(doctorId);
    return doctor ? doctor.name : 'Unknown';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.doctorId || !formData.date || !formData.time) {
      setError('Please fill all required fields.');
      return;
    }

    let patientId = formData.patientId;

    // 👇 If new patient selected
    if (isNewPatient) {
      if (!newPatientData.name || !newPatientData.age || !newPatientData.department || !newPatientData.contact) {
        setError('Please fill all new patient details.');
        return;
      }

      const newPatient = { id: Date.now(), ...newPatientData };
      addPatient(newPatient);
      patientId = newPatient.id; // use new patient's id
    }

    const appointmentData = { ...formData, patientId };

    if (editingId) {
      updateAppointment(editingId, appointmentData);
    } else {
      addAppointment(appointmentData);
    }

    // Reset all fields
    setFormData({ patientId: '', doctorId: '', date: '', time: '', status: 'Scheduled' });
    setNewPatientData({ name: '', age: '', department: '', contact: '' });
    setIsNewPatient(false);
    setEditingId(null);
    setError('');
  };

  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingId(appointment.id);
  };

  const handleDelete = (id) => {
    if (user.role !== 'admin') {
      setError('Only admins can delete appointments.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(id);
      setError('');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Appointment Booking</h1>
      <p className="mb-4">Role: {user.role} - {user.role === 'admin' ? 'Full access' : 'View & Book appointments'}</p>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Appointment' : 'Book New Appointment'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Checkbox for new patient */}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              checked={isNewPatient}
              onChange={() => setIsNewPatient(!isNewPatient)}
              className="mr-2"
            />
            <label className="font-medium">New Patient?</label>
          </div>

          {!isNewPatient ? (
            // Existing patient selection
            <select
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="p-3 border rounded"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} (Age: {patient.age})
                </option>
              ))}
            </select>
          ) : (
            // New patient form fields
            <>
              <input
                type="text"
                placeholder="Patient Name"
                value={newPatientData.name}
                onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                className="p-3 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={newPatientData.age}
                onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
                className="p-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={newPatientData.department}
                onChange={(e) => setNewPatientData({ ...newPatientData, department: e.target.value })}
                className="p-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={newPatientData.contact}
                onChange={(e) => setNewPatientData({ ...newPatientData, contact: e.target.value })}
                className="p-3 border rounded"
                required
              />
            </>
          )}

          {/* Doctor */}
          <select
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            className="p-3 border rounded"
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} ({doctor.specialty})
              </option>
            ))}
          </select>

          {/* Date, Time, Status */}
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="p-3 border rounded"
            required
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="p-3 border rounded"
            required
          />

          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="p-3 border rounded md:col-span-2"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 md:col-span-2"
          >
            {editingId ? 'Update Appointment' : 'Book Appointment'}
          </button>
        </form>
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Appointments List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{getPatientName(appointment.patientId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getDoctorName(appointment.doctorId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'Scheduled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : appointment.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {appointments.length === 0 && (
          <p className="p-4 text-gray-500 text-center">No appointments scheduled yet.</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;






