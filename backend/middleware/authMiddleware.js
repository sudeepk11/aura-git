// Imports
const jwt = require("jsonwebtoken");
const errors = require("../configs/error.codes.json");
const User = require("../models/User");
const Response = require("../models/standard.response.model");
const { jwtDecoded, errorHandler } = require("../utils/utils");

// Body
async function requireAuth(req, res, next) {
  let token = req.cookies.jwt;
  if (!token) token = req.headers.authorization;

  if (!token) return res.status(401).send(Response(errors[401].authRequired));

  // Function to log out
  const logOut = () => res.cookie("jwt", "", { maxAge: 1 });

  try {
    const decoded = await jwtDecoded(token);

    if (!decoded) {
      logOut();

      // Invalid/Expired token
      return res.status(401).send(Response(errors[401].invalidOrExpiredToken));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      logOut();

      return res.status(404).send(Response(errors[404].userNotFound));
    }

    if (decoded.last_password_reset !== user._profile_information.last_password_reset.getTime()) {
      logOut();

      return res.status(440).send(Response(errors[440].sessionExpired));
    }

    res.locals.user = user;
    res.locals.refreshProfile = async () => {
      res.locals.profile = await User.findById(decoded.id, "-password");
    };
    await res.locals.refreshProfile();
  } catch (error) {
    logOut();

    if (error instanceof jwt.TokenExpiredError)
      return res.status(440).send(errors[440].sessionInvalidated);

    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}
async function requireVerifiedAuth(req, res, next) {
  await requireAuth(req, res, () => { });
  if (!res.locals.user) return;

  // Function to log out
  const logOut = () => res.cookie("jwt", "", { maxAge: 1 });

  if (!res.locals.user.email_verified) {
    logOut();

    return res.status(403).send(Response(errors[403].emailUnverified));
  }

  return next();
}

// check current user
async function checkUser(req, res, next) {
  // Set `user` and `profile` to null
  res.locals.user = null;
  res.locals.profile = null;

  let token = req.cookies.jwt;
  if (!token) token = req.headers.authorization;

  // Skip if no token is provided
  if (!token) return next();

  // Function to log out
  const logOut = () => res.cookie("jwt", "", { maxAge: 1 });

  try {
    const decoded = await jwtDecoded(token);

    if (decoded) {
      const user = await User.findById(decoded.id);
      if (user && decoded.last_password_reset === user._profile_information.last_password_reset.getTime() && user.email_verified) {
        res.locals.user = user;
        res.locals.refreshProfile = async () => {
          res.locals.profile = await User.findById(decoded.id, "-password");
        };
        await res.locals.refreshProfile();
      } else
        logOut();
    } else
      logOut();
  } catch (error) {
    logOut();
  }

  return next();
}

module.exports = { requireAuth, requireVerifiedAuth, checkUser };
