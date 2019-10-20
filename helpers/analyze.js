// Imports the Google Cloud client library
const language = require("@google-cloud/language");

async function analyze(text) {
  // Instantiates a client
  const client = new language.LanguageServiceClient();

  const document = {
    content: text,
    type: "PLAIN_TEXT"
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({ document: document });
  const sentiment = result.documentSentiment;

  console.log(`Text: ${text}`);
  console.log(`Sentiment score: ${sentiment.score}`);
  console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  return {
    Text: text,
    Score: sentiment.score,
    "Positive Level": result.sentences.filter(x => x.sentiment.score > 0.25)
      .length,
    "Negative Level": result.sentences.filter(x => x.sentiment.score < -0.25)
      .length,
    "Neutral Level": result.sentences.filter(
      x => x.sentiment.score > -0.25 && x.sentiment.score < 0.25
    ).length
  };
}

module.exports = analyze;
