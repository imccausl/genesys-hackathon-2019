const API = {
  root: "https://api.genesysappliedresearch.com/v2/knowledge/",
  searchKnowledgeBase: knowledgebaseId => {
    return `knowledgebases/${knowledgebaseId}/search`;
  },
  updateKnowledgeBase: knowledgebaseId => {
    return `knowledgebases/${knowledgebaseId}/languages/en-US/documents/`;
  },
  trainKnowledgeBase: knowledgebaseId => {
    return `knowledgebases/${knowledgebaseId}/languages/en-US/trainings`;
  },
  knowledgeBases: "knowledgebases"
};

const CONFIDENCE_THRESHOLD = 0.6;
const CONFIDENCE_LOWER_THRESHOLD = 0.3;
const HANDOFF_THRESHOLD = -0.4;

const CLASSIFIER_API_ENDPOINT = "http://localhost:5000/";

const KNOWLEDGE_BASES = {
  slack: "1995df85-0984-4683-baa5-dc87a94b183d",
  finance: "75a77b65-e85b-4d94-864d-7f7e812131eb"
};

module.exports = {
  API,
  CONFIDENCE_LOWER_THRESHOLD,
  CONFIDENCE_THRESHOLD,
  CLASSIFIER_API_ENDPOINT,
  KNOWLEDGE_BASES,
  HANDOFF_THRESHOLD
};
