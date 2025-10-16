import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// Mock departments
const mockDepartments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'];

export const DataProvider = ({ children }) => {
  // 🧩 Load Patients from localStorage
  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: 'John Doe', age: 30, department: 'Cardiology', contact: '123-456' },
      { id: 2, name: 'Jane Smith', age: 25, department: 'Neurology', contact: '789-012' },
    ];
  });

  // 🧩 Load Doctors from localStorage
  const [doctors, setDoctors] = useState(() => {
    const stored = localStorage.getItem('doctors');
    return stored ? JSON.parse(stored) : [
      { id: 1, name: 'Dr. Alice Johnson', specialty: 'Cardiology', department: 'Cardiology', contact: '111-222' },
      { id: 2, name: 'Dr. Bob Wilson', specialty: 'Neurology', department: 'Neurology', contact: '333-444' },
    ];
  });

  // 🧩 Load Appointments from localStorage
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [
      { id: 1, patientId: 1, doctorId: 1, date: '2023-10-01', time: '10:00 AM', status: 'Scheduled' },
      { id: 2, patientId: 2, doctorId: 2, date: '2023-10-02', time: '2:00 PM', status: 'Completed' },
    ];
  });

  // 🧠 Auto-save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // CRUD: Patients
  const addPatient = (patient) => setPatients([...patients, { id: Date.now(), ...patient }]);
  const updatePatient = (id, patient) => setPatients(patients.map(p => p.id === id ? { ...p, ...patient } : p));
  const deletePatient = (id) => setPatients(patients.filter(p => p.id !== id));
  const getPatient = (id) => patients.find(p => p.id === Number(id));

  // CRUD: Doctors
  const addDoctor = (doctor) => setDoctors([...doctors, { id: Date.now(), ...doctor }]);
  const updateDoctor = (id, doctor) => setDoctors(doctors.map(d => d.id === id ? { ...d, ...doctor } : d));
  const deleteDoctor = (id) => setDoctors(doctors.filter(d => d.id !== id));
  const getDoctor = (id) => doctors.find(d => d.id === Number(id));

  // CRUD: Appointments
  const addAppointment = (appointment) => setAppointments([...appointments, { id: Date.now(), ...appointment }]);
  const updateAppointment = (id, appointment) => setAppointments(appointments.map(a => a.id === id ? { ...a, ...appointment } : a));
  const deleteAppointment = (id) => setAppointments(appointments.filter(a => a.id !== id));
  const getAppointment = (id) => appointments.find(a => a.id === Number(id));

  return (
    <DataContext.Provider value={{
      patients, doctors, appointments, departments: mockDepartments,
      addPatient, updatePatient, deletePatient, getPatient,
      addDoctor, updateDoctor, deleteDoctor, getDoctor,
      addAppointment, updateAppointment, deleteAppointment, getAppointment,
    }}>
      {children}
    </DataContext.Provider>
  );
};