// Start log
const { logInfo } = require("./utils/winston.util");
logInfo("[START]");

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
const receiptRoutes = require("./routes/receiptRoutes");
const collegeReceiptRoutes = require("./routes/collegeReceiptRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const newsRoutes = require("./routes/newsRoutes");
const logRoutes = require("./routes/logRoutes");
const { reqResLogger } = require("./middleware/reqResLogger");

// Route Middlewares
expressApp.get("*", reqResLogger, checkUser);
expressApp.use("/auth/user", reqResLogger, authRoutes);
expressApp.use("/users", reqResLogger, userRoutes);
expressApp.use("/events", reqResLogger, eventRoutes);
expressApp.use("/teams", reqResLogger, teamRoutes);
expressApp.use("/tickets", reqResLogger, ticketRoutes);
expressApp.use("/receipts", reqResLogger, receiptRoutes);
expressApp.use("/college-receipts", reqResLogger, collegeReceiptRoutes);
expressApp.use("/submissions", reqResLogger, submissionRoutes);
expressApp.use("/news", reqResLogger, newsRoutes);
expressApp.use("/logs", logRoutes);

// Setup cron jobs
require("./scripts/cron.jobs.script");
