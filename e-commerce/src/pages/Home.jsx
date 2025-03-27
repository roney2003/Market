import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Redirect ke liye
import "./Home.css";

const Home = ({ addToCart, cartItems }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Navigation ke liye

  const products = [
    { id: 1, name: "Smartphone", price: 19999, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop" },
    { id: 2, name: "Laptop", price: 49999, image: "https://plus.unsplash.com/premium_photo-1681302427948-2fd0eca629b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFwdG9wfGVufDB8fDB8fHww" },
    { id: 3, name: "Headphones", price: 2999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop" },
    { id: 4, name: "Smartwatch", price: 9999, image: "https://images.unsplash.com/photo-1617625802912-cde586faf331?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D" },
    { id: 5, name: "Camera", price: 34999, image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D" },
    { id: 6, name: "Tablet", price: 24999, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&h=150&fit=crop" },
    { id: 7, name: "Gaming Console", price: 39999, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&h=150&fit=crop" },
    { id: 8, name: "Bluetooth Speaker", price: 4999, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150&h=150&fit=crop" },
    { id: 9, name: "Wireless Mouse", price: 1499, image: "https://images.unsplash.com/photo-1662323861979-0538474387e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdpcmVsZXNzJTIwbW91c2V8ZW58MHx8MHx8fDA%3D" },
    { id: 10, name: "Keyboard", price: 2999, image: "https://images.unsplash.com/photo-1555532538-dcdbd01d373d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D" },
    { id: 11, name: "Monitor", price: 15999, image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9uaXRvcnxlbnwwfHwwfHx8MA%3D%3D" },
    { id: 12, name: "External HDD", price: 5999, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=150&h=150&fit=crop" },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total price of cart items
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Our E-Commerce Store</h1>
        <p>Find the best products at unbeatable prices!</p>
      </header>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary Section */}
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.name} - ₹{item.price} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
            <button className="checkout-button" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;