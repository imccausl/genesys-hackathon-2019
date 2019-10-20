const API = {
  root: "https://api.genesysappliedresearch.com/v2/knowledge/",
  searchKnowledgeBase: knowledgebaseId => {
    return `knowledgebases/${knowledgebaseId}/search`;
  },
  knowledgeBases: "knowledgebases"
};

const CONFIDENCE_THRESHOLD = 0.6;
const CLASSIFIER_API_ENDPOINT = "http://localhost:5000/";

module.exports = { API, CONFIDENCE_THRESHOLD, CLASSIFIER_API_ENDPOINT };
