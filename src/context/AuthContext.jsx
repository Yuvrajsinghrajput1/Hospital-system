 import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Check if user already saved in localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login logic
  const login = (username, password) => {
    // Mock users
    if (username === "admin" && password === "admin") {
      const loggedUser = { id: 1, username, role: "admin" };
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      return true;
    } else if (username === "staff" && password === "staff") {
      const loggedUser = { id: 2, username, role: "staff" };
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  // Logout logic
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // If user state changes, sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };