const API = {
  root: "https://api.genesysappliedresearch.com/v2/knowledge/",
  searchKnowledgeBase: knowledgebaseId => {
    return `knowledgebases/${knowledgebaseId}/search`;
  },
  knowledgeBases: "knowledgebases"
};

module.exports = { API };
