const { logError } = require("./winston.util");

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET;

const RECAPTCHA_URL = process.env.RECAPTCHA_VERIFICATION_URL;

async function verifyCaptchaToken(token, userIP) {
  let isVerified = false;

  if (token === undefined || String(token).trim() === "") return (isVerified = true);

  try {
    const body = {
      secret: RECAPTCHA_SECRET_KEY,
      response: token,
      remoteip: userIP,
    };

    const res = await fetch(RECAPTCHA_URL, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const captchaResponse = await res.json();

    if (captchaResponse?.success === undefined) {
      throw new Error("Failed to verify captcha");
    }

    isVerified = captchaResponse.success;
  } catch (e) {
    logError(e);
  }

  return isVerified;
}

module.exports = {
  verifyCaptchaToken,
};
