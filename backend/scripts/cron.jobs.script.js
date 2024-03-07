const cron = require("node-cron");
const Users = require("../models/User");

const { ACC_AUTODELETE_CRON_EXPRESSION = "* */2 * * * *" } = process.env;

cron.schedule(
  ACC_AUTODELETE_CRON_EXPRESSION,
  async () => {
    const results = await Users.aggregate([
      {
        $group: {
          _id: "$phone",
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 4 } } },
    ]);

    for (const result of results) await Users.deleteMany({ phone: result._id });
  },
  { timezone: "Asia/Kolkata" }
);
