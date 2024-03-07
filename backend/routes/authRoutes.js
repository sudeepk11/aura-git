// Imports
const { Router } = require("express");
const { rateLimit } = require("express-rate-limit");
const stdResponse = require("../models/standard.response.model");
const { checkUser } = require("../middleware/authMiddleware");
const { complete } = require("../controllers/controllers");
const authController = require("../controllers/authController");

// Constants
const { AUTH_SIGNUP_RATE_LIMIT_MAX_COUNT = 1, AUTH_SIGNUP_RATE_LIMIT_WINDOW_SIZE = 120000 } = process.env;
const router = Router();
const oneRequestPer2MinutesRateLimiter = rateLimit({
  limit: AUTH_SIGNUP_RATE_LIMIT_MAX_COUNT,
  windowMs: AUTH_SIGNUP_RATE_LIMIT_WINDOW_SIZE,
  message: stdResponse("Rate limited"),
});

// Body
router.post("/signup", oneRequestPer2MinutesRateLimiter, authController.signup_post, complete);
router.post("/login", authController.login_post, complete);
router.get("/logout", authController.logout_get, complete);

router.get("/status", checkUser, authController.authStatusController, complete);

module.exports = router;
