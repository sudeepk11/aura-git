const { validationResult } = require("express-validator");
const fs = require("fs");
const StdResponse = require("../models/standard.response.model");

const expressValidationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.unlinkSync(req.file.path);
    if (req.files) req.files.forEach((file) => fs.unlinkSync(file.path));

    return res.status(400).json(StdResponse(errors.array()[0].msg, {}));
  }

  return next();
};

module.exports = { expressValidationErrorHandler };
