require('dotenv').config();

var request = require("request");

var options = {
  method: "POST",
  url:
    "https://api.genesysappliedresearch.com/v2/knowledge/knowledgebases//search",
  headers: {
    "Postman-Token": "997a9125-d3b6-4256-9d5c-e2db99773b86",
    "cache-control": "no-cache",
    token: global.token,
    organizationid: ,
    "Content-Type": "application/json"
  },
  body: {
    query,
    pageSize: 5,
    pageNumber: 1,
    sortOrder: "string",
    sortBy: "string",
    languageCode: "en-US",
    documentType: "Faq"
  },
  json: true
};

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
