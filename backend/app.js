const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors({ origin: "http://localhost:3001" }));

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
