// Imports
const fs = require("fs");
const path = require("path");
const meta = require("../configs/meta.json");

// Constants
const emailVerificationTemplate = path.join(__dirname, "..", "templates", "email.verification.template.html");
const passwordResetTemplate = path.join(__dirname, "..", "templates", "password.reset.template.html");

const emailVerificationDarkTemplate = path.join(__dirname, "..", "templates", "email.verification.dark.template.html");
const passwordResetDarkTemplate = path.join(__dirname, "..", "templates", "password.reset.dark.template.html");

// Body
const chooseEmailVerificationTemplate = async function ({
  user_name = "",
  redirect_uri = "#",
  reply_mail = meta.emails.reply_email,
}) {
  try {
    let html = (
      await new Promise((resolve, reject) => {
        fs.readFile(emailVerificationTemplate, (error, data) => {
          if (error) return reject(error);

          resolve(data);
        });
      })
    ).toString();

    html = html
      .split("{{user_name}}")
      .join(user_name)
      .split("{{redirect_uri}}")
      .join(redirect_uri)
      .split("{{reply_email}}")
      .join(reply_mail);

    return html;
  } catch (error) {
    console.error("[templates.util]", error);
  }

  return null;
};

const choosePasswordResetTemplate = async function ({
  user_name = "",
  dismiss_uri = "#",
  redirect_uri = "#",
  reply_mail = meta.emails.reply_email,
}) {
  try {
    let html = (
      await new Promise((resolve, reject) => {
        fs.readFile(passwordResetTemplate, (error, data) => {
          if (error) return reject(error);

          resolve(data);
        });
      })
    ).toString();

    html = html
      .split("{{user_name}}")
      .join(user_name)
      .split("{{dismiss_uri}}")
      .join(dismiss_uri)
      .split("{{redirect_uri}}")
      .join(redirect_uri)
      .split("{{reply_email}}")
      .join(reply_mail);

    return html;
  } catch (error) {
    console.error("[templates.util]", error);
  }

  return null;
};

const chooseEmailVerificationDarkTemplate = async function ({
  user_name = "",
  redirect_uri = "#",
  reply_mail = meta.emails.reply_email,
}) {
  try {
    let html = (
      await new Promise((resolve, reject) => {
        fs.readFile(emailVerificationDarkTemplate, (error, data) => {
          if (error) return reject(error);

          resolve(data);
        });
      })
    ).toString();

    html = html
      .split("{{user_name}}")
      .join(user_name)
      .split("{{redirect_uri}}")
      .join(redirect_uri)
      .split("{{reply_email}}")
      .join(reply_mail);

    return html;
  } catch (error) {
    console.error("[templates.util]", error);
  }

  return null;
};

const choosePasswordResetDarkTemplate = async function ({
  user_name = "",
  dismiss_uri = "#",
  redirect_uri = "#",
  reply_mail = meta.emails.reply_email,
}) {
  try {
    let html = (
      await new Promise((resolve, reject) => {
        fs.readFile(passwordResetDarkTemplate, (error, data) => {
          if (error) return reject(error);

          resolve(data);
        });
      })
    ).toString();

    html = html
      .split("{{user_name}}")
      .join(user_name)
      .split("{{dismiss_uri}}")
      .join(dismiss_uri)
      .split("{{redirect_uri}}")
      .join(redirect_uri)
      .split("{{reply_email}}")
      .join(reply_mail);

    return html;
  } catch (error) {
    console.error("[templates.util]", error);
  }

  return null;
};

module.exports = {
  chooseEmailVerificationTemplate,
  choosePasswordResetTemplate,
  chooseEmailVerificationDarkTemplate,
  choosePasswordResetDarkTemplate,
};
