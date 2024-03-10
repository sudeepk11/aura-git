// Imports
const errors = require("../configs/error.codes.json");
const { requireVerifiedAuth } = require("./authMiddleware");
const Response = require("../models/standard.response.model");

// Body
async function requireAdminAuth(req, res, next) {
  await requireVerifiedAuth(req, res, () => {});
  if (!res.locals.user) return;

  const user = res.locals.user;
  if (user.role !== "admin") return res.status(401).send(Response(errors[401].adminAuthRequired));

  return next();
}

module.exports = { requireAdminAuth };
