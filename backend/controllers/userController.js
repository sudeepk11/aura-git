// Imports
const errors = require("../configs/error.codes.json");
const queryConfig = require("../configs/query.config.json");
const User = require("../models/User");
const Response = require("../models/standard.response.model");
const { errorHandler, quoteRegExp } = require("../utils/utils");

// Body
async function userGetController(req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findById(id, "-password");
    if (!user) return res.status(404).send(Response(errors[404].userNotFound));

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.user = user;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function userGetByAuraIdController(req, res, next) {
  try {
    const { auraId } = req.params;

    const user = await User.findOne({ aura_id: auraId }, "-password");
    if (!user) return res.status(404).send(Response(errors[404].userNotFound));

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.user = user;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function userCheckInByAuraIdController(req, res, next) {
  try {
    const { auraId } = req.params;

    if (!(await User.exists({ aura_id: auraId }))) return res.status(404).send(Response(errors[404].userNotFound));

    await User.updateOne(
      { aura_id: auraId },
      {
        $set: {
          checked_in: true,
        },
      }
    );

    const user = await User.findOne({ aura_id: auraId }, "-password");
    if (!user) return res.status(404).send(Response(errors[404].userNotFound));

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.user = user;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function userSearchController(req, res, next) {
  try {
    let {
      aura_id = undefined,
      email = undefined,
      college = undefined,
      name = undefined,
      usn = undefined,
      phone = undefined,
      email_verified = undefined,
      pageSize = queryConfig["search.pagination"]["page.size"],
      paginationTs = Date.now(),
    } = req.query;
    pageSize = parseInt(pageSize, 10);
    paginationTs = parseInt(paginationTs, 10);

    if (
      !aura_id &&
      !email &&
      !college &&
      !name &&
      !usn &&
      !phone &&
      (email_verified === undefined || !/^(true|false)$/i.test(email_verified))
    )
      return res.status(400).send(Response(errors[400].searchQueryRequired));

    if (aura_id) aura_id = quoteRegExp(aura_id);
    if (email) email = quoteRegExp(email);
    if (college) college = quoteRegExp(college);
    if (name) name = quoteRegExp(name);
    if (usn) usn = quoteRegExp(usn);
    if (phone) phone = quoteRegExp(phone);
    if (typeof email_verified === "string") email_verified = email_verified.toLowerCase() === "true";

    const query = {};
    if (aura_id) query.aura_id = { $regex: queryConfig["search.options"].aura_id.replace("{aura_id}", aura_id), $options: "i" };
    if (email) query.email = { $regex: queryConfig["search.options"].email.replace("{email}", email), $options: "i" };
    if (college) query.college = { $regex: queryConfig["search.options"].college.replace("{college}", college), $options: "i" };
    if (name) query.name = { $regex: queryConfig["search.options"].name.replace("{name}", name), $options: "i" };
    if (usn) query.usn = { $regex: queryConfig["search.options"].usn.replace("{usn}", usn), $options: "i" };
    if (phone) query.phone = { $regex: queryConfig["search.options"].phone.replace("{phone}", phone), $options: "i" };
    if (typeof email_verified === "boolean") query.email_verified = email_verified;

    if (typeof pageSize === "string") pageSize = parseInt(pageSize, 10);
    if (pageSize <= 0 || pageSize > queryConfig["search.pagination"]["page.max.size"])
      pageSize = queryConfig["search.pagination"]["page.size"];

    const users = await User.find(
      {
        ...query,
        "_profile_information.account_creation_timestamp": { $lte: paginationTs },
      },
      "-password"
    )
      .sort({ "_profile_information.account_creation_timestamp": -1 })
      .limit(pageSize + 1);

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.pageSize = pageSize;
    res.locals.data.resultsSize = users.length === pageSize + 1 ? pageSize : users.length;
    res.locals.data.paginationTs =
      users.length - 1 === pageSize ? users[users.length - 1]._profile_information.account_creation_timestamp : null;
    res.locals.data.results = users.slice(0, pageSize).filter((value) => !!value);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function userUpdateController(req, res, next) {
  if (!res.locals.user) return res.status(401).send(Response(errors[401].authRequired));

  try {
    const { body } = req;

    const { name = undefined, usn = undefined, college = undefined, phone = undefined } = body;

    const user = res.locals.user;
    if (name !== undefined) user.name = name;
    if (usn !== undefined) user.usn = usn;
    if (college !== undefined) user.college = college;
    if (phone !== undefined) user.phone = phone;

    await res.locals.user.save();
    await res.locals.refreshProfile();
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

module.exports = {
  userGetController,
  userGetByAuraIdController,
  userCheckInByAuraIdController,
  userSearchController,
  userUpdateController,
};
