const API = {
  root: "https://api.genesysappliedresearch.com/v2/knowledge/",
  searchKnowledgeBase: knowledgebaseId => {
    return `knowledgebases/${knowledgebaseId}/search`;
  },
  knowledgeBases: "knowledgebases"
};

const CONFIDENCE_THRESHOLD = 0.6;
const CONFIDENCE_LOWER_THRESHOLD = 0.3;
const kbId = {
  first: "1995df85-0984-4683-baa5-dc87a94b183d"
};
module.exports = {
  API,
  CONFIDENCE_THRESHOLD,
  CONFIDENCE_LOWER_THRESHOLD,
  kbId
};
