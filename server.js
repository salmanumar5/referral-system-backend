require("dotenv").config();
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const connectDB = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 4000;

//Connect to Database
connectDB();

//Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Reduce response size for performance
app.use(morgan("dev")); // Logs API requests

//Rate Limiting (Prevents brute-force attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP
  message: "Too many requests, please try again later.",
});
app.use(limiter);

//Routes
app.use("/api/auth", require("./src/routes/authRotues"));
app.use("/api/referral", require("./src/routes/referralRoutes"));

//404 Handler (Handles unknown routes)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

//Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

//Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});

//Graceful Shutdown (Handles app termination properly)
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
