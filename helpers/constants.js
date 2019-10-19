const API = {
    root: "https://api.genesysappliedresearch.com/v2/knowledge/",
    searchKnowledgebase = (knowledgebaseId) => {
        return `knowledgebases/${knowledgebaseId}/search`;
    }
}

module.exports = {API};
