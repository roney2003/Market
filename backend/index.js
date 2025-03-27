const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const USERS_FILE = "users.json";
const PRODUCTS_FILE = "products.json";

// Utility functions
const readFileSafe = (file) => {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf-8"));
    }
    return [];
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
};

const writeFileSafe = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing to ${file}:`, err);
    return false;
  }
};

// Products API
app.get("/api/products", (req, res) => {
  const products = readFileSafe(PRODUCTS_FILE);
  res.json(products);
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }
  let users = readFileSafe(USERS_FILE);
  let user = users.find((u) => u.email === email);
  if (user) {
    if (user.password === password) {
      user.role = email === "admin@example.com" ? "admin" : "user";
      return res.json({ success: true, user });
    } else {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }
  } else {
    user = { email, password, id: Date.now(), role: email === "admin@example.com" ? "admin" : "user" };
    users.push(user);
    if (writeFileSafe(USERS_FILE, users)) {
      return res.json({ success: true, user });
    } else {
      return res.status(500).json({ success: false, message: "Failed to save user" });
    }
  }
});

// Users API (Admin)
app.get("/api/users", (req, res) => {
  const users = readFileSafe(USERS_FILE);
  res.json(users);
});

// Logout API
app.post("/api/logout", (req, res) => {
  res.json({ success: true, message: "Logged out" });
});

// Dynamic Port Handling
const PORT = process.env.PORT || 3001;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
    }
  });

  process.on("SIGINT", () => {
    console.log("Shutting down server...");
    server.close(() => {
      console.log("Server stopped, port released.");
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    console.log("Shutting down server...");
    server.close(() => {
      console.log("Server stopped, port released.");
      process.exit(0);
    });
  });

  return server;
}

startServer(PORT);