const API = {
  root: "https://api.genesysappliedresearch.com/v2/knowledge/",
  searchKnowledgeBase: knowledgebaseId => {
    return `knowledgebases/${knowledgebaseId}/search`;
  },
  knowledgeBases: "knowledgebases"
};

const CONFIDENCE_THRESHOLD = 0.6;

module.exports = { API, CONFIDENCE_THRESHOLD };
