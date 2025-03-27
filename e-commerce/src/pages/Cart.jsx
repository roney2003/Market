import React from "react";

const Cart = ({ cart, removeFromCart }) => {
  return (
    <div>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id}>
            <img src={item.image} alt={item.name} style={{ width: "100px", height: "100px" }} />
            <h3>{item.name}</h3>
            <p>₹{item.price} x {item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;