// Imports
const { Router } = require("express");
const { complete } = require("../controllers/controllers");
const authController = require("../controllers/authController");

// Constants
const router = Router();

// Body
router.post("/signup", authController.signup_post, complete);
router.post("/login", authController.login_post, complete);
router.get("/logout", authController.logout_get, complete);

module.exports = router;
