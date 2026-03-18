const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./utils/db");  // ✅ import here

const app = express();

app.use(cors());
app.use(express.json());

// Test DB connection
pool.connect()
  .then(() => console.log("PostgreSQL Connected ✅"))
  .catch(err => console.error("DB Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Pandit Ji AI Backend Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create users table on startup
const { createUsersTable } = require("./services/userService");

createUsersTable();