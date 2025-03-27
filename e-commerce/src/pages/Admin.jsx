import React, { useState, useEffect } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("API URL:", import.meta.env.VITE_API_URL); // Debugging
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setUsers(data); // Users array set karo
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Unable to load users. Please try again.");
      }
    };

    fetchUsers();
  }, []); // Empty dependency array - sirf mount pe run hoga

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Registered Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{user.id}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{user.email}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;