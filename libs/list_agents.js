
import { fileURLToPath } from "node:url";

import {
    BedrockAgentClient,
    paginateListAgents,
} from "@aws-sdk/client-bedrock-agent";

/**
 * Retrieves a list of available Amazon Bedrock agents utilizing the paginator function.
 *
 * This function leverages a paginator, which abstracts the complexity of pagination, providing
 * a straightforward way to handle paginated results inside a `for await...of` loop.
 *
 * @param {string} [region='us-west-2'] - The AWS region in use.
 * @returns {Promise<AgentSummary[]>} An array of agent summaries.
 */
export const listAgentsWithPaginator = async (region = "us-west-2") => {
    const client = new BedrockAgentClient({ region });

    const paginatorConfig = {
        client,
        pageSize: 10, // optional, added for demonstration purposes
    };

    const pages = paginateListAgents(paginatorConfig, {});

    // Paginate until there are no more results
    const agentSummaries = [];
    for await (const page of pages) {
        agentSummaries.push(...page.agentSummaries);
    }

    return agentSummaries;
};

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    console.log("=".repeat(68));
    console.log("Listing agents using the paginateListAgents function:");
    for (const agent of await listAgentsWithPaginator()) {
        console.log(agent);
    }
}

