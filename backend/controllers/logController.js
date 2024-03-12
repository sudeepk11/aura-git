// Imports
const {
  getInfoLogs,
  getInfoLogByFileName,
  getErrorLogs,
  getErrorLogByFileName,
  getReqResLogs,
  getReqResLogByFileName,
} = require("../utils/logs.util");

// Body

async function getInfoLogFilesCtrl(req, res, next) {
  try {
    const files = getInfoLogs();
    return res.status(200).send(files.join("\n"));
  } catch (error) {
    console.error(error);
  }
}
async function getInfoLogFileContentCtrl(req, res, next) {
  try {
    const { params } = req;

    const { fileName } = params;

    const fileReadStream = getInfoLogByFileName(fileName);
    if (fileReadStream === null) return res.status(404).send("Specified file " + fileName + " was not found.");

    fileReadStream.pipe(res);

    res.on("close", () => {
      try {
        fileReadStream.close();
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function getErrorLogFilesCtrl(req, res, next) {
  const files = getErrorLogs();
  return res.status(200).send(files.join("\n"));
}
async function getErrorLogFileContentCtrl(req, res, next) {
  try {
    const { params } = req;

    const { fileName } = params;

    const fileReadStream = getErrorLogByFileName(fileName);
    if (fileReadStream === null) return res.status(404).send("Specified file " + fileName + " was not found.");

    fileReadStream.pipe(res);

    res.on("close", () => {
      try {
        fileReadStream.close();
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function getReqResLogFilesCtrl(req, res, next) {
  const files = getReqResLogs();
  return res.status(200).send(files.join("\n"));
}
async function getReqResLogFileContentCtrl(req, res, next) {
  try {
    const { params } = req;

    const { fileName } = params;

    const fileReadStream = getReqResLogByFileName(fileName);
    if (fileReadStream === null) return res.status(404).send("Specified file " + fileName + " was not found.");

    fileReadStream.pipe(res);

    res.on("close", () => {
      try {
        fileReadStream.close();
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getInfoLogFilesCtrl,
  getInfoLogFileContentCtrl,
  getErrorLogFilesCtrl,
  getErrorLogFileContentCtrl,
  getReqResLogFilesCtrl,
  getReqResLogFileContentCtrl,
};
