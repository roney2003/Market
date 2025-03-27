
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Logout function call karo
    navigate("/login"); // Login page pe redirect
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart</Link>
      {/* Admin link sirf admin ke liye */}
      {user && user.role === "admin" && <Link to="/admin">Admin</Link>}
      {/* Logout button agar user logged in hai */}
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;