// Imports
const { Router } = require("express");
const { param } = require("express-validator");

const { expressValidationErrorHandler } = require("../middleware/validationErrorHandler");
const { requireAdminAuth } = require("../middleware/adminAuthMiddleware");
const {
  getInfoLogFilesCtrl,
  getInfoLogFileContentCtrl,
  getErrorLogFilesCtrl,
  getErrorLogFileContentCtrl,
  getReqResLogFilesCtrl,
  getReqResLogFileContentCtrl,
} = require("../controllers/logController");

// Constants
const router = new Router();

// Body

router.get("/info", requireAdminAuth, getInfoLogFilesCtrl);
router.get(
  "/info/:fileName",
  requireAdminAuth,
  param("fileName").exists().withMessage("Please provide file name").notEmpty().withMessage("Please provide a valid file name"),
  expressValidationErrorHandler,
  getInfoLogFileContentCtrl
);

router.get("/error", requireAdminAuth, getErrorLogFilesCtrl);
router.get(
  "/error/:fileName",
  requireAdminAuth,
  param("fileName").exists().withMessage("Please provide file name").notEmpty().withMessage("Please provide a valid file name"),
  expressValidationErrorHandler,
  getErrorLogFileContentCtrl
);

router.get("/req-res", requireAdminAuth, getReqResLogFilesCtrl);
router.get(
  "/req-res/:fileName",
  requireAdminAuth,
  param("fileName").exists().withMessage("Please provide file name").notEmpty().withMessage("Please provide a valid file name"),
  expressValidationErrorHandler,
  getReqResLogFileContentCtrl
);

module.exports = router;
