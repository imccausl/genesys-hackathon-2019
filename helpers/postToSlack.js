const _request = require("request");
const { promisify } = require("util");
const request = promisify(_request);

const postToSlack = async (channel, message) => {
  const body = JSON.stringify({
    channel,
    text: message
  });

  const options = {
    method: "POST",
    url: "https://slack.com/api/chat.postMessage",
    headers: {
      Connection: "keep-alive",
      Host: "slack.com",
      Accept: "*/*",
      Authorization:
        "Bearer xoxb-801358426645-801872597797-z7M9nOuoKLG8eOqOsQcEE1KB",
      "Content-type": "application/json"
    },
    body
  };

  await request(options);
};

module.exports = postToSlack;
