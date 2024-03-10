// Imports
const express = require("express");
const { param } = require("express-validator");
const errors = require("../configs/error.codes.json");
const { expressValidationErrorHandler } = require("../middleware/validationErrorHandler");
const { requireVerifiedAuth } = require("../middleware/authMiddleware");
const { requireAdminAuth } = require("../middleware/adminAuthMiddleware");
const { complete } = require("../controllers/controllers");
const {
  userGetController,
  userGetByAuraIdController,
  userCheckInByAuraIdController,
  userIssueAuraPassByAuraIdController,
  userSearchController,
  userUpdateController,
} = require("../controllers/userController");

// Constants
const Router = express.Router();

// Body
Router.get("/search", userSearchController, complete);
Router.get("/:id", userGetController, complete);
Router.get(
  "/aura-id/:auraId",
  param("auraId")
    .exists()
    .withMessage(errors[400].auraIdRequired)
    .matches(/^AURA24-[A-Z]{3}-\d{5}$/)
    .withMessage(errors[400].invalidAuraId),
  expressValidationErrorHandler,
  userGetByAuraIdController,
  complete
);

Router.post(
  "/aura-id/:auraId/issue-aura-pass",
  requireAdminAuth,
  param("auraId")
    .exists()
    .withMessage(errors[400].auraIdRequired)
    .matches(/^AURA24-[A-Z]{3}-\d{5}$/)
    .withMessage(errors[400].invalidAuraId),
  expressValidationErrorHandler,
  userIssueAuraPassByAuraIdController,
  complete
);

Router.post(
  "/aura-id/:auraId/check-in",
  requireAdminAuth,
  param("auraId")
    .exists()
    .withMessage(errors[400].auraIdRequired)
    .matches(/^AURA24-[A-Z]{3}-\d{5}$/)
    .withMessage(errors[400].invalidAuraId),
  expressValidationErrorHandler,
  userCheckInByAuraIdController,
  complete
);

Router.patch("/", requireVerifiedAuth, userUpdateController, complete);

module.exports = Router;
