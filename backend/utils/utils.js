// Imports
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const meta = require("../configs/meta.json");
const errors = require("../configs/error.codes.json");
const { bcrypt: bcryptConfig, "aura.id": auraIdConfig } = require("../configs/utils.config.json");
const { logError } = require("./winston.util");

// - `nodemailer`
const { NODEMAILER_SERVICE = "gmail", NODEMAILER_EMAIL, NODEMAILER_PASS } = process.env;
const transporter = nodemailer.createTransport({
  service: NODEMAILER_SERVICE,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASS,
  },
});

const nodemailerCreateMail = ({ from = NODEMAILER_EMAIL, to, subject, text = undefined, html = undefined }) => ({
  from,
  to,
  subject,
  ...(text ? { text } : { html }),
});
const nodemailerSendMail = async (mail) => transporter.sendMail(mail);
//

// - Aura Id generator
const pad = (num, padLength) => (new Array(padLength).join("0") + num).slice(-padLength);

const { prefix, delimiter, "name.length": nameLength, "suffix.digits.length": suffixLength } = auraIdConfig;

// prefix delimiter name delimiter suffix
const genAuraId = (name) =>
  `${prefix}${delimiter}${name
    .replace(/[^a-z]/gi, "")
    .toUpperCase()
    .substring(0, nameLength)}${delimiter}${pad(Math.floor(Math.random() * Math.pow(10, suffixLength)), suffixLength)}`;
//

// - `jwt`
const { JWT_SECRET } = process.env;

const jwtCreate = function (obj, expires = undefined) {
  return jwt.sign(
    obj,
    JWT_SECRET,
    expires
      ? {
          expiresIn: expires,
        }
      : undefined
  );
};
const jwtDecoded = async function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      return resolve(decoded);
    });
  });
};
//

// `bcrypt`
async function bcryptHash(s) {
  return bcrypt.hash(s, bcryptConfig["salt.rounds"]);
}
async function bcryptCompare(hash, s) {
  return bcrypt.compare(s, hash);
}
//

module.exports = {
  nodemailerCreateMail,
  nodemailerSendMail,
  genAuraId,
  jwtCreate,
  jwtDecoded,
  bcryptHash,
  bcryptCompare,
  errorHandler: function (error, unique_error = errors[400].duplicateError) {
    if (typeof error === "string") {
      logError(`Plain text error: ${error}`);
      return { status: 500, message: error };
    }

    try {
      // `JsonWebTokenError`
      if (error instanceof JsonWebTokenError) {
        return {
          status: 401,
          message: errors[401].invalidOrExpiredToken,
        };
      }

      // `ValidationError`
      if (error.name === "ValidationError") {
        logError(`Validation error: "${JSON.stringify(error.errors)}"`);

        return {
          status: 400,
          message: Object.values(error.errors).find((_error) => _error.properties).message,
        };
      }

      // Mongoose unique key invalidation error?
      if (error.code === 11000) {
        logError(`Unique key validation error: "${JSON.stringify(error)}"`);
        return {
          status: 400,
          message: unique_error,
        };
      }

      if ("message" in error) {
        logError(`Error message: "${error.message}"`);
        return {
          status: 400,
          message: error.message,
        };
      }

      logError(`Unhandled error: ${JSON.stringify(error)}`);
      return {
        status: 500,
        message: errors[500],
      };
    } catch (fatal_error) {
      logError(`FATAL: "${JSON.stringify(fatal_error)}"\nFATAL WAS CAUSED BY: "${JSON.stringify(error)}"`);
      console.error("[FATAL]", fatal_error);
    }

    return {
      status: 500,
      message: errors[500],
    };
  },
  quoteRegExp: (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  sluggify: (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/, " ")
      .split(" ")
      .join("-"),
};
