// Imports
const mongoose = require("mongoose");
const errors = require("../configs/error.codes.json");
const queryConfig = require("../configs/query.config.json");
const StdResponse = require("../models/standard.response.model");
const User = require("../models/User");
const Event = require("../models/Event");
const CollegeReceipt = require("../models/CollegeReceipt");
const Receipt = require("../models/Receipt");
const Team = require("../models/Team");
const { errorHandler } = require("../utils/utils");

// Body

function getCollegeReceiptDeductionAmountByEventTeamSize(teamSize) {
  if (teamSize === 1) return -99;
  if (teamSize === 2) return -199;
  if (teamSize === 3 || teamSize === 4) return -299;

  return -399;
}

async function getAllCollegeReceiptsCtrl(req, res, next) {
  try {
    const { query } = req;

    let { pageSize = queryConfig["search.pagination"]["page.size"], paginationTs = Date.now(), approved = undefined } = query;
    pageSize = parseInt(pageSize, 10);
    paginationTs = parseInt(paginationTs, 10);

    if (typeof pageSize === "string") pageSize = parseInt(pageSize, 10);
    if (pageSize <= 0 || pageSize > queryConfig["search.pagination"]["page.max.size"])
      pageSize = queryConfig["search.pagination"]["page.size"];

    const collegeReceipts = await CollegeReceipt.find({
      ...(approved === undefined ? {} : { isApproved: approved === "true" }),
      createdAt: { $lte: paginationTs },
    })
      .sort({ createdAt: -1 })
      .limit(pageSize + 1);

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.pageSize = pageSize;
    res.locals.data.resultsSize = collegeReceipts.length === pageSize + 1 ? pageSize : collegeReceipts.length;
    res.locals.data.paginationTs =
      collegeReceipts.length - 1 === pageSize ? collegeReceipts[collegeReceipts.length - 1].createdAt.getTime() : null;
    res.locals.data.results = collegeReceipts.slice(0, pageSize).filter((receipt) => !!receipt);
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function getCollegeReceiptByTransactionIdCtrl(req, res, next) {
  try {
    const { params } = req;

    const { transactionId } = params;

    const collegeReceipt = await CollegeReceipt.findOne({ transactionId });
    if (!collegeReceipt) return res.status(404).send(Response(errors[404].collegeReceiptNotFound));

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.collegeReceipt = collegeReceipt;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function approveCollegeReceiptCtrl(req, res, next) {
  try {
    const { params } = req;

    const { id } = params;

    if (!(await CollegeReceipt.exists({ _id: id }))) return res.status(404).send(Response(errors[404].collegeReceiptNotFound));

    const updatedCollegeReceipt = await CollegeReceipt.findByIdAndUpdate(
      id,
      {
        $set: {
          isApproved: true,
        },
      },
      { new: true }
    );

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.collegeReceipt = updatedCollegeReceipt;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function disapproveCollegeReceiptCtrl(req, res, next) {
  try {
    const { params } = req;

    const { id } = params;

    if (!(await CollegeReceipt.exists({ _id: id }))) return res.status(404).send(Response(errors[404].collegeReceiptNotFound));

    const updatedCollegeReceipt = await CollegeReceipt.findByIdAndUpdate(
      id,
      {
        $set: {
          isApproved: false,
        },
      },
      { new: true }
    );

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.collegeReceipt = updatedCollegeReceipt;
  } catch (error) {
    const { status, message } = errorHandler(error);
    return res.status(status).send(Response(message));
  }

  return next();
}

async function createCollegeReceiptCtrl(req, res, next) {
  try {
    const { body } = req;

    const { collegeName, collegeSecret, amount, transactionId } = body;

    // Check if the college secret already exists
    if (await CollegeReceipt.exists({ collegeSecret }))
      return res.status(400).send(StdResponse(errors[400].duplicateCollegeSecret));

    // Check if the transaction id already exists
    if (await CollegeReceipt.exists({ transactionId }))
      return res.status(400).send(StdResponse(errors[400].duplicateTransactionId));

    const collegeReceipt = await CollegeReceipt.create({
      collegeName,
      collegeSecret,
      amount,
      balanceLeft: amount,
      transactionId,
    });

    if (!res.locals.data) res.locals.data = {};
    res.locals.data.collegeReceipt = collegeReceipt;
    res.locals.status = 201;
  } catch (error) {
    const { status, message } = errorHandler(error, errors[400].duplicateCollegeSecretOrTransactionId);
    return res.status(status).send(StdResponse(message));
  }

  next();
}

async function registerUsingCollegeReceiptCtrl(req, res, next) {
  try {
    const { body } = req;

    const { teamId, collegeSecret, transactionId } = body;

    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).send(StdResponse(errors[404].teamNotFound));

    // Check if the team has already paid (receipt exists)
    if (await Receipt.exists({ team: team._id })) return res.status(400).send(StdResponse(errors[400].alreadyPaid));

    // Check if the college receipt exists
    let collegeReceipt = await CollegeReceipt.findOne({ collegeSecret, transactionId });
    if (!collegeReceipt) return res.status(404).send(StdResponse(errors[404].collegeReceiptNotFound));

    // Check if the college receipt is approved
    if (!collegeReceipt.isApproved) return res.status(400).send(StdResponse(errors[400].collegeReceiptUnapproved));

    // Get event from team id
    const aggregateResult = await Team.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(teamId),
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "event_participated.event_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          "event._id": 1,
          "event.team_size": 1,
          "event.__v": 1,
        },
      },
    ]);
    let event = aggregateResult[0].event;

    // Get deduction amount for that event
    const deductionAmount = getCollegeReceiptDeductionAmountByEventTeamSize(event.team_size);
    const minimumRequiredBalance = -1 * deductionAmount;

    // Attempt to deduct the registration fees from college receipt
    const result = await CollegeReceipt.updateOne(
      {
        collegeSecret,
        transactionId,
        balanceLeft: {
          $gte: minimumRequiredBalance,
        },
      },
      {
        $inc: {
          balanceLeft: deductionAmount,
        },
      }
    );
    if (result.modifiedCount === 0) return res.status(400).send(StdResponse(errors[400].collegeReceiptOutOfBalance));

    // Deduction successful
    // Generate a receipt for the payment
    // Create receipt
    const receipt = await Receipt.create({
      user: team.team_leader.id,
      event: team.event_participated.event_id,
      team: team._id,
      transaction_id: transactionId,
      options: {
        paidByCollege: true,
        collegeSecret,
      },
    });

    // Update user
    await User.updateOne(
      { _id: team.team_leader.id },
      {
        $push: {
          paid_for: {
            event_id: team.event_participated.event_id,
            receipt_id: receipt._id,
          },
        },
      }
    );

    // Update event
    event = await Event.findById(team.event_participated.event_id);
    const index = event.registered_teams.findIndex((reg_team) => String(reg_team.team_id) === String(team._id));

    if (index === -1) {
      // Create entry

      const results = await Event.updateOne(
        { _id: event._id },
        {
          $push: {
            registered_teams: {
              team_id: teamId,
              leader_id: team.team_leader.id,
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
    const { status, message } = errorHandler(error, errors[400].duplicateCollegeSecretOrTransactionId);
    return res.status(status).send(StdResponse(message));
  }

  next();
}

module.exports = {
  getAllCollegeReceiptsCtrl,
  getCollegeReceiptByTransactionIdCtrl,
  approveCollegeReceiptCtrl,
  disapproveCollegeReceiptCtrl,
  createCollegeReceiptCtrl,
  registerUsingCollegeReceiptCtrl,
};
