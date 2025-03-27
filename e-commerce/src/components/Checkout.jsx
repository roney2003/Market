import React, { useState, useEffect } from "react";

// Function to dynamically load Razorpay script
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const Checkout = ({ cartItems, clearCart }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Calculate total amount in paise and ensure it's an integer
    const total = Math.floor(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100);
    console.log("Cart Items:", cartItems);
    console.log("Calculated Total Amount (in paise):", total);
    setTotalAmount(total);

    // Reset body overflow on mount
    document.body.style.overflow = "auto";
  }, [cartItems]);

  // Function to initiate Razorpay payment directly from frontend
  const handlePayment = async () => {
    try {
      // Load Razorpay script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        setError("Razorpay failed to load. Please try again.");
        return;
      }

      // Razorpay Checkout options (without order_id)
      const options = {
        key: "rzp_test_8rkETOgG647TQ2", // Test key (only key_id, no key_secret)
        amount: totalAmount, // Amount in paise (e.g., 82999600 for ₹829996.00)
        currency: "INR",
        name: "Your E-commerce Store",
        description: "Test Transaction",
        image: "https://example.com/your_logo", // Add your logo URL
        prefill: {
          name: "Suryansh Ronak",
          email: "suryanshronak3@gmail.com",
          contact: "782761282",
        },
        notes: {
          address: "Test Address",
        },
        theme: {
          color: "#007bff",
        },
        handler: (response) => {
          // Payment success callback
          console.log("Payment Success:", response);
          setPaymentDetails({
            id: response.razorpay_payment_id,
            amount: totalAmount,
            status: "captured",
            method: "unknown", // Method not available in response
          });
          clearCart();
          alert("Payment successful! Thank you for your purchase.");
          document.body.style.overflow = "auto";
        },
        modal: {
          ondismiss: () => {
            document.body.style.overflow = "auto";
            setError("Payment cancelled by user.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Payment Failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
        document.body.style.overflow = "auto";
      });
      rzp.open();
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {paymentDetails && (
        <div>
          <h3>Payment Details</h3>
          <p>Payment ID: {paymentDetails.id}</p>
          <p>Amount: ₹{(paymentDetails.amount / 100).toFixed(2)}</p>
          <p>Status: {paymentDetails.status}</p>
          <p>Method: {paymentDetails.method}</p>
        </div>
      )}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ₹{item.price} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <h3>Total: ₹{(totalAmount / 100).toFixed(2)}</h3>
          <button onClick={handlePayment}>Pay Now</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;