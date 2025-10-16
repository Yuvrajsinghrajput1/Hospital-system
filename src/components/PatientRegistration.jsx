import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const PatientRegistration = () => {
  const { user } = useAuth();
  const { patients, departments, addPatient, updatePatient, deletePatient } = useData();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    department: "",
    contact: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.department || !formData.contact) {
      setError("⚠️ All fields are required.");
      return;
    }

    if (editingId) {
      updatePatient(editingId, formData);
    } else {
      addPatient(formData);
    }

    setFormData({ name: "", age: "", department: "", contact: "" });
    setEditingId(null);
    setError("");
  };

  const handleEdit = (patient) => {
    setFormData(patient);
    setEditingId(patient.id);
  };

  const handleDelete = (id) => {
    if (user.role !== "admin") {
      setError("❌ Only admins can delete patients.");
      return;
    }
    deletePatient(id);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 transition-all duration-300">
      <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
        🏥 Patient Registration
      </h2>

      {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />

        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />

        <select
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select Department</option>
          {departments.map((dept, i) => (
            <option key={i} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {editingId ? "Update Patient" : "Add Patient"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
        👥 Registered Patients
      </h3>

      {patients.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No patients registered yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {patient.name} —{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {patient.department}
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Age: {patient.age} | Contact: {patient.contact}
                </p>
              </div>

              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(patient)}
                  className="px-4 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="px-4 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientRegistration;