// Load and cache all Environment variables
require("dotenv").config();

// Connect to MongoDB
require("./scripts/mongodb.script");

// Start Express server
const { expressApp } = require("./utils/express.util");

// Middlewares and Routes
const { checkUser } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const teamRoutes = require("./routes/teamRoutes");

// Not in use
// const paymentRoutes = require("./routes/paymentRoutes");

// Route Middlewares
expressApp.get("*", checkUser);
expressApp.use("/auth/user", authRoutes);
expressApp.use("/users", userRoutes);
expressApp.use("/events", eventRoutes);
expressApp.use("/teams", teamRoutes);
expressApp.use("/tickets", ticketRoutes);

// Not in use
// expressApp.use("/payments", paymentRoutes);