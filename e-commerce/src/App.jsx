import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { gsap } from "gsap";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Checkout from "./components/Checkout"; // Checkout component import karo
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import "./App.css";

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatbotRef = useRef(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!chatbotRef.current) {
      console.log("Ref is null!");
      return;
    }
    console.log("Animating chatbot, show:", showChatbot);
    if (showChatbot) {
      gsap.set(chatbotRef.current, { display: "block" }); // Ensure visible
      gsap.fromTo(
        chatbotRef.current,
        { y: "100%", rotateX: -90, opacity: 0 },
        {
          y: "0%",
          rotateX: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => console.log("Animation complete: show"),
        }
      );
    } else {
      gsap.to(chatbotRef.current, {
        y: "100%",
        rotateX: -90,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          console.log("Animation complete: hide");
          gsap.set(chatbotRef.current, { display: "none" }); // Hide after animation
        },
      });
    }
  }, [showChatbot]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]); // Cart clear karne ka function
  };

  const handleLogin = (userData) => {
    console.log("handleLogin called with:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) {
    return <div>Wait...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <Home addToCart={addToCart} cartItems={cart} /> // cartItems pass kiya
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route path="/products" element={<Products addToCart={addToCart} />} />
            <Route
              path="/cart"
              element={<Cart cart={cart} removeFromCart={removeFromCart} />}
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/admin"
              element={user && user.role === "admin" ? <Admin /> : <Navigate to="/login" />}
            />
            <Route
              path="/checkout"
              element={<Checkout cartItems={cart} clearCart={clearCart} />} // Checkout route add kiya
            />
          </Routes>
        </div>
        <button
          className="chatbot-toggle"
          onClick={() => setShowChatbot(!showChatbot)}
        >
          {showChatbot ? "Close Chat" : "Open Chat"}
        </button>
        <div ref={chatbotRef} className={`chatbot-container ${showChatbot ? "show" : "hide"}`}>
          <Chatbot />
        </div>
      </div>
    </Router>
  );
}

export default App;