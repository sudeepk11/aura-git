const { logReqResCycle } = require("../utils/winston.util");

function reqResLogger(req, res, next) {
  const originalWrite = res.write;
  const originalEnd = res.end;

  const chunks = [];
  res.write = (chunk) => {
    chunks.push(chunk);
    originalWrite.apply(res, [chunk]);
  };

  res.end = (chunk) => {
    if (chunk) {
      chunks.push(chunk);
    }

    const responseBody = Buffer.concat(chunks).toString("utf-8");
    let responseJson = null;

    try {
      responseJson = JSON.parse(responseBody);
    } catch (error) {
      console.error(error);
    }

    originalEnd.apply(res, [chunk]);

    logReqResCycle.info({
      message: "API Request",
      method: req.method,
      path: req.path,
      url: req.url,
      query: req.query,
      headers: req.headers,
      body: req.body,
      response: {
        status: res.statusCode,
        response: responseJson ?? responseBody,
        headers: res.getHeaders(),
      },
    });
  };

  next();
}

module.exports = { reqResLogger };
