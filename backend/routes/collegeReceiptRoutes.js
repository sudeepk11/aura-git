// Imports
const { Router } = require("express");
const { param, query, body } = require("express-validator");
const errorCodes = require("../configs/error.codes.json");
const { expressValidationErrorHandler } = require("../middleware/validationErrorHandler");
const { requireAdminAuth } = require("../middleware/adminAuthMiddleware");
const { complete } = require("../controllers/controllers");
const {
  getAllCollegeReceiptsCtrl,
  getCollegeReceiptByTransactionIdCtrl,
  approveCollegeReceiptCtrl,
  disapproveCollegeReceiptCtrl,
  createCollegeReceiptCtrl,
  registerUsingCollegeReceiptCtrl,
} = require("../controllers/collegeReceiptController");

// Constants
const router = Router();

// Body
router.get(
  "/",
  requireAdminAuth,
  query("approved")
    .optional()
    .notEmpty()
    .withMessage(errorCodes[400].approvedQueryParamCannotBeEmpty)
    .isBoolean()
    .withMessage(errorCodes[400].invalidApprovedQueryParam),
  expressValidationErrorHandler,
  getAllCollegeReceiptsCtrl,
  complete
);

router.get(
  "/:transactionId",
  requireAdminAuth,
  param("transactionId")
    .exists()
    .withMessage(errorCodes[400].transactionIdRequired)
    .matches(/^[a-z0-9-]+$/i)
    .withMessage(errorCodes[400].invalidTransactionId),
  expressValidationErrorHandler,
  getCollegeReceiptByTransactionIdCtrl,
  complete
);

router.post(
  "/:id/approve",
  requireAdminAuth,
  param("id")
    .exists()
    .withMessage(errorCodes[400].collegeReceiptIdRequired)
    .isMongoId()
    .withMessage(errorCodes[400].invalidCollegeReceiptId),
  expressValidationErrorHandler,
  approveCollegeReceiptCtrl,
  complete
);

router.post(
  "/:id/disapprove",
  requireAdminAuth,
  param("id")
    .exists()
    .withMessage(errorCodes[400].collegeReceiptIdRequired)
    .isMongoId()
    .withMessage(errorCodes[400].invalidCollegeReceiptId),
  expressValidationErrorHandler,
  disapproveCollegeReceiptCtrl,
  complete
);

router.post(
  "/",
  body("collegeName")
    .exists()
    .withMessage(errorCodes[400].collegeRequired)
    .notEmpty()
    .withMessage(errorCodes[400].invalidCollege),
  body("collegeSecret")
    .exists()
    .withMessage(errorCodes[400].collegeSecretRequired)
    .notEmpty()
    .withMessage(errorCodes[400].invalidCollegeSecret)
    .matches(/^[a-z0-9-]{6,}$/i)
    .withMessage(errorCodes[400].invalidCollegeSecret),
  body("amount")
    .exists()
    .withMessage(errorCodes[400].amountRequired)
    .isFloat({ min: 1 })
    .withMessage(errorCodes[400].invalidAmount),
  body("transactionId")
    .exists()
    .withMessage(errorCodes[400].transactionIdRequired)
    .notEmpty()
    .withMessage(errorCodes[400].invalidTransactionId)
    .matches(/^[a-z0-9-]+$/i)
    .withMessage(errorCodes[400].invalidTransactionId),
  expressValidationErrorHandler,
  createCollegeReceiptCtrl,
  complete
);

router.post(
  "/register",
  body("teamId").exists().withMessage(errorCodes[400].teamIdRequired).isMongoId().withMessage(errorCodes[400].invalidTeamId),
  body("transactionId")
    .exists()
    .withMessage(errorCodes[400].transactionIdRequired)
    .notEmpty()
    .withMessage(errorCodes[400].invalidTransactionId)
    .matches(/^[a-z0-9-]+$/i)
    .withMessage(errorCodes[400].invalidTransactionId),
  body("collegeSecret")
    .exists()
    .withMessage(errorCodes[400].collegeSecretRequired)
    .notEmpty()
    .withMessage(errorCodes[400].invalidCollegeSecret)
    .matches(/^[a-z0-9-]{6,}$/i)
    .withMessage(errorCodes[400].invalidCollegeSecret),
  expressValidationErrorHandler,
  registerUsingCollegeReceiptCtrl,
  complete
);

module.exports = router;
