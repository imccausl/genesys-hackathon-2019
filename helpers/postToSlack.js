const _request = require("request");
const { promisify } = require("util");
const request = promisify(_request);

const postToSlack = botToken => {
  return async (channel, message, asUser = false) => {
    const body = JSON.stringify({
      channel,
      text: message,
      as_user: asUser
    });

    const options = {
      method: "POST",
      url: "https://slack.com/api/chat.postMessage",
      headers: {
        Connection: "keep-alive",
        Host: "slack.com",
        Accept: "*/*",
        Authorization: `Bearer ${botToken}`,
        "Content-type": "application/json"
      },
      body
    };

    await request(options);
  };
};

module.exports = postToSlack;
