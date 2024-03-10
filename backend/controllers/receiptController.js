// Imports
const errors = require("../configs/error.codes.json");
const queryConfig = require("../configs/query.config.json");
const Response = require("../models/standard.response.model");
const Receipt = require("../models/Receipt");
const Event = require("../models/Event");
const Team = require("../models/Team");
const User = require("../models/User");
const { errorHandler } = require("../utils/utils");

// Body
async function receiptGetAllController(req, res, next) {
  try {
    const { query } = req;

    let { pageSize = queryConfig["search.pagination"]["page.size"], paginationTs = Date.now() } = query;
    pageSize = parseInt(pageSize, 10);
    paginationTs = parseInt(paginationTs, 10);

    if (typeof pageSize === "string") pageSize = parseInt(pageSize, 10);
    if (pageSize <= 0 || pageSize > queryConfig["search.pagination"]["page.max.size"])
      pageSize = queryConfig["search.pagination"]["page.size"];

    const receipts = await Receipt.find({
      createdAt: { $lte: paginationTs },
    })
      .sort({ createdAt: -1 })
      .limit(pageSize + 1)
      .populate([
        {
          path: "user",
          select: "-password -paid_for",
        },
        {
          path: "event",
          select: "-registered_teams",
        },
        {
          path: "team",
        },
      ]);

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.pageSize = pageSize;
    res.locals.data.resultsSize = receipts.length === pageSize + 1 ? pageSize : receipts.length;
    res.locals.data.paginationTs = receipts.length - 1 === pageSize ? receipts[receipts.length - 1].createdAt.getTime() : null;
    res.locals.data.results = receipts.slice(0, pageSize).filter((receipt) => !!receipt);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function receiptGetByCurrentUserController(req, res, next) {
  if (!res.locals.user) return res.status(401).send(Response(errors[401].authRequired));

  try {
    const { query } = req;

    let { pageSize = queryConfig["search.pagination"]["page.size"], paginationTs = Date.now() } = query;
    pageSize = parseInt(pageSize, 10);
    paginationTs = parseInt(paginationTs, 10);

    if (typeof pageSize === "string") pageSize = parseInt(pageSize, 10);
    if (pageSize <= 0 || pageSize > queryConfig["search.pagination"]["page.max.size"])
      pageSize = queryConfig["search.pagination"]["page.size"];

    const receipts = await Receipt.find({
      user: res.locals.user._id,
      createdAt: { $lte: paginationTs },
    })
      .sort({ createdAt: -1 })
      .limit(pageSize + 1)
      .populate([
        {
          path: "user",
          select: "-password -paid_for",
        },
        {
          path: "event",
          select: "-registered_teams",
        },
        {
          path: "team",
        },
      ]);

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.pageSize = pageSize;
    res.locals.data.resultsSize = receipts.length === pageSize + 1 ? pageSize : receipts.length;
    res.locals.data.paginationTs = receipts.length - 1 === pageSize ? receipts[receipts.length - 1].createdAt.getTime() : null;
    res.locals.data.results = receipts.slice(0, pageSize).filter((receipt) => !!receipt);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function receiptGetByIdController(req, res, next) {
  try {
    const { params } = req;

    const { id } = params;

    const receipt = await Receipt.findById(id).populate([
      {
        path: "user",
        select: "-password",
      },
      {
        path: "event",
      },
      {
        path: "team",
      },
    ]);
    if (!receipt) return res.status(404).send(Response(errors[404].receiptNotFound));

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.receipt = receipt;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function receiptGetByEventController(req, res, next) {
  try {
    const { params, query } = req;

    const { id } = params;
    let { pageSize = queryConfig["search.pagination"]["page.size"], paginationTs = Date.now() } = query;
    pageSize = parseInt(pageSize, 10);
    paginationTs = parseInt(paginationTs, 10);

    if (typeof pageSize === "string") pageSize = parseInt(pageSize, 10);
    if (pageSize <= 0 || pageSize > queryConfig["search.pagination"]["page.max.size"])
      pageSize = queryConfig["search.pagination"]["page.size"];

    if (!(await Event.findById(id))) return res.status(404).send(Response(errors[404].eventNotFound));

    const receipts = await Receipt.find({
      event: id,
      createdAt: { $lte: paginationTs },
    })
      .sort({ createdAt: -1 })
      .limit(pageSize + 1)
      .populate([
        {
          path: "user",
          select: "-password -paid_for",
        },
        {
          path: "event",
          select: "-registered_teams",
        },
        {
          path: "team",
        },
      ]);

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.pageSize = pageSize;
    res.locals.data.resultsSize = receipts.length === pageSize + 1 ? pageSize : receipts.length;
    res.locals.data.paginationTs = receipts.length - 1 === pageSize ? receipts[receipts.length - 1].createdAt.getTime() : null;
    res.locals.data.results = receipts.slice(0, pageSize).filter((receipt) => !!receipt);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function receiptGetByEventAndCurrentUserController(req, res, next) {
  if (!res.locals.user) return res.status(401).send(Response(errors[401].authRequired));

  try {
    const { params } = req;

    const { id } = params;

    if (!(await Event.findById(id))) return res.status(404).send(Response(errors[404].eventNotFound));

    const receipt = await Receipt.findOne({
      event: id,
      user: res.locals.user._id,
    }).populate([
      {
        path: "user",
        select: "-password -paid_for",
      },
      {
        path: "event",
        select: "-registered_teams",
      },
      {
        path: "team",
      },
    ]);

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.receipt = receipt;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function receiptGetByTeamController(req, res, next) {
  try {
    const { params } = req;

    const { id } = params;

    const team = await Team.findById(id);
    if (!team) return res.status(404).send(Response(errors[404].teamNotFound));

    const receipt = await Receipt.findOne({ team: team._id });
    if (!receipt) return res.status(404).send(Response(errors[404].receiptNotFound));

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.receipt = await receipt.getPopulated();
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }
  return next();
}

async function receiptGetStatsParticipationController(req, res, next) {
  try {
    const aggregation = [
      {
        $lookup: {
          from: "teams",
          localField: "team",
          foreignField: "_id",
          as: "_team",
        },
      },
      {
        $match: {
          "_team.0": {
            $exists: true,
          },
        },
      },
      {
        $set: {
          team_doc: {
            $arrayElemAt: ["$_team", 0],
          },
        },
      },
      {
        $project: {
          users: {
            $concatArrays: [
              [
                {
                  $ifNull: ["$team_doc.team_leader.id", null],
                },
              ],
              "$team_doc.team_members.id",
            ],
          },
        },
      },
      {
        $unwind: "$users",
      },
      {
        $group: {
          _id: "$users",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $count: "total_participation",
      },
    ];
    const result = await Receipt.aggregate(aggregation);

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.result = result;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function receiptGetStatsGitParticipationController(req, res, next) {
  try {
    const aggregation = [
      {
        $lookup: {
          from: "teams",
          localField: "team",
          foreignField: "_id",
          as: "_team",
        },
      },
      {
        $match: {
          "_team.0": {
            $exists: true,
          },
        },
      },
      {
        $set: {
          team_doc: {
            $arrayElemAt: ["$_team", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "_user",
        },
      },
      {
        $match: {
          $or: [
            {
              "_user.0.college": {
                $regex: "^(?=.* ?k.?l.?s *g.?i.?t ?.*).+$",
                $options: "i",
              },
            },
            {
              "_user.0.college": {
                $regex: "^(?=.* ?g.?i.?t ?.*).+$",
                $options: "i",
              },
            },
            {
              "_user.0.college": {
                $regex:
                  "^(?=.* ?gogte +(institute|instiue|instiut|instuite) +(of|o|f) +(tech|techno|technology|technlogy) ?.*).+$",
                $options: "i",
              },
            },
            {
              "_user.0.college": {
                $regex: "^(?=.* ?C-1439 ?.*).+$",
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $project: {
          users: {
            $concatArrays: [
              [
                {
                  $ifNull: ["$team_doc.team_leader.id", null],
                },
              ],
              "$team_doc.team_members.id",
            ],
          },
        },
      },
      {
        $unwind: "$users",
      },
      {
        $group: {
          _id: "$users",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $count: "total_gitian_participation",
      },
    ];
    const result = await Receipt.aggregate(aggregation);

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.result = result;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function receiptCreateController(req, res, next) {
  if (!res.locals.user) return res.status(401).send(Response(errors[401].authRequired));

  try {
    const { body } = req;

    const { team_id = undefined, transaction_id = undefined } = body;

    if (team_id === undefined) return res.status(400).send(Response(errors[400].teamIdRequired));
    if (transaction_id === undefined) return res.status(400).send(Response(errors[400].transactionIdRequired));

    if (!/^[a-z0-9-]+$/i.test(transaction_id)) return res.status(400).send(Response(errors[400].invalidTransactionId));

    // Check if team exists and belongs to current user
    const team = await Team.findById(team_id);
    if (!team) return res.status(404).send(Response(errors[404].teamNotFound));
    if (String(team.team_leader.id) !== String(res.locals.user._id))
      return res.status(403).send(Response(errors[403].invalidOperation));

    // Check if any other receipt exists with the same transaction id
    if (await Receipt.exists({ transaction_id })) return res.status(400).send(Response(errors[400].receiptExists));

    // Create receipt
    const receipt = await Receipt.create({
      user: res.locals.user._id,
      event: team.event_participated.event_id,
      team: team._id,
      transaction_id,
    });

    // Update user
    res.locals.user.paid_for.push({
      event_id: team.event_participated.event_id,
      receipt_id: receipt._id,
    });
    await res.locals.user.save();
    await res.locals.refreshProfile();

    // Update event
    const event = await Event.findById(team.event_participated.event_id);
    const index = event.registered_teams.findIndex((reg_team) => String(reg_team.team_id) === String(team._id));

    if (index === -1) {
      // Create entry

      const results = await Event.updateOne(
        { _id: event._id },
        {
          $push: {
            registered_teams: {
              team_id: team_id,
              leader_id: res.locals.user._id,
              payment: {
                status: true,
                receipt_id: receipt._id,
              },
            },
          },
        }
      );

      if (results.modifiedCount === 0) throw Error("Unable to update entry in registered_teams");
    } else {
      // Update existing entry

      const query = { $set: {} };
      query.$set[`registered_teams.${index}.payment`] = {
        status: true,
        receipt_id: receipt._id,
      };
      const results = await Event.updateOne({ _id: event._id }, query);
      if (results.modifiedCount === 0) throw Error("Event update failed!");
    }

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.receipt = receipt;
    res.locals.status = 201;
  } catch (error) {
    const { status, message } = errorHandler(error, errors[400].receiptExists);
    return res.status(status).send(Response(message));
  }

  return next();
}
async function receiptCreateNoAuthController(req, res, next) {
  try {
    const { body } = req;

    const { team_id = undefined, transaction_id = undefined } = body;

    if (team_id === undefined) return res.status(400).send(Response(errors[400].teamIdRequired));
    if (transaction_id === undefined) return res.status(400).send(Response(errors[400].transactionIdRequired));

    if (!/^[a-z0-9-]+$/i.test(transaction_id)) return res.status(400).send(Response(errors[400].invalidTransactionId));

    // Check if team exists and belongs to current user
    const team = await Team.findById(team_id);
    if (!team) return res.status(404).send(Response(errors[404].teamNotFound));

    // Check if team leader exists
    const user = await User.findById(team.team_leader.id);
    if (!user) return res.status(404).send(Response(errors[404].userNotFound));

    // Create receipt
    const receipt = await Receipt.create({
      user: team.team_leader.id,
      event: team.event_participated.event_id,
      team: team._id,
      transaction_id,
    });

    // Update user
    user.paid_for.push({
      event_id: team.event_participated.event_id,
      receipt_id: receipt._id,
    });
    await user.save();

    // Update event
    const event = await Event.findById(team.event_participated.event_id);
    const index = event.registered_teams.findIndex((reg_team) => String(reg_team.team_id) === String(team._id));

    if (index === -1) {
      // Create entry

      const results = await Event.updateOne(
        { _id: event._id },
        {
          $push: {
            registered_teams: {
              team_id: team_id,
              leader_id: user._id,
              payment: {
                status: true,
                receipt_id: receipt._id,
              },
            },
          },
        }
      );

      if (results.modifiedCount === 0) throw Error("Unable to update entry in registered_teams");
    } else {
      // Update existing entry

      const query = { $set: {} };
      query.$set[`registered_teams.${index}.payment`] = {
        status: true,
        receipt_id: receipt._id,
      };
      const results = await Event.updateOne({ _id: event._id }, query);
      if (results.modifiedCount === 0) throw Error("Event update failed!");
    }

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.receipt = receipt;
    res.locals.status = 201;
  } catch (error) {
    const { status, message } = errorHandler(error, errors[400].receiptExists);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function receiptUpdateController(req, res, next) {
  if (!res.locals.user) return res.status(401).send(Response(errors[401].authRequired));

  try {
    const { params, body } = req;

    const { id } = params;
    const { transaction_id = undefined } = body;

    // Check if any other receipt exists with the same transaction id
    if (await Receipt.exists({ transaction_id })) return res.status(400).send(Response(errors[400].receiptExists));

    // Check if receipt exists and belongs to current user
    const receipt = await Receipt.findById(id);
    if (!receipt) return res.status(404).send(Response(errors[404].receiptNotFound));
    if (String(receipt.user) !== String(res.locals.user._id))
      return res.status(403).send(Response(errors[403].invalidOperation));

    if (transaction_id !== undefined) receipt.transaction_id = transaction_id;

    await receipt.save();

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.receipt = await receipt.getPopulated();
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

module.exports = {
  receiptGetAllController,
  receiptGetByCurrentUserController,
  receiptGetByIdController,
  receiptGetByEventController,
  receiptGetByEventAndCurrentUserController,
  receiptGetByTeamController,
  receiptGetStatsParticipationController,
  receiptGetStatsGitParticipationController,
  receiptCreateController,
  receiptCreateNoAuthController,
  receiptUpdateController,
};
