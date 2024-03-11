// Imports
const path = require("path");
const fs = require("fs");

// Constants
const infoLogsPath = path.join(__dirname, "..", "info_logs");
const errorLogsPath = path.join(__dirname, "..", "error_logs");
const reqResLogsPath = path.join(__dirname, "..", "req_res_logs");

// Body
function getInfoLogs() {
  const logs = fs.readdirSync(infoLogsPath).filter((fileName) => !fileName.startsWith("."));
  return logs;
}
function getInfoLogByFileName(fileName) {
  const filePath = path.join(infoLogsPath, fileName);
  if (!fs.existsSync(filePath)) return null;

  return fs.createReadStream(filePath);
}

function getErrorLogs() {
  const logs = fs.readdirSync(errorLogsPath).filter((fileName) => !fileName.startsWith("."));
  return logs;
}
function getErrorLogByFileName(fileName) {
  const filePath = path.join(errorLogsPath, fileName);
  if (!fs.existsSync(filePath)) return null;

  return fs.createReadStream(filePath);
}

function getReqResLogs() {
  const logs = fs.readdirSync(reqResLogsPath).filter((fileName) => !fileName.startsWith("."));
  return logs;
}
function getReqResLogByFileName(fileName) {
  const filePath = path.join(reqResLogsPath, fileName);
  if (!fs.existsSync(filePath)) return null;

  return fs.createReadStream(filePath);
}

module.exports = {
  getInfoLogs,
  getInfoLogByFileName,
  getErrorLogs,
  getErrorLogByFileName,
  getReqResLogs,
  getReqResLogByFileName,
};
