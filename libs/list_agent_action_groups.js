
import { fileURLToPath } from "node:url";

import {
    BedrockAgentClient,
    paginateListAgentActionGroups,
} from "@aws-sdk/client-bedrock-agent";

/**
 * Retrieves a list of Action Groups of an agent utilizing the paginator function.
 *
 * This function leverages a paginator, which abstracts the complexity of pagination, providing
 * a straightforward way to handle paginated results inside a `for await...of` loop.
 *
 * @param {string} agentId - The unique identifier of the agent.
 * @param {string} agentVersion - The version of the agent.
 * @param {string} [region='us-west-2'] - The AWS region in use.
 * @returns {Promise<ActionGroupSummary[]>} An array of action group summaries.
 */
export const listAgentActionGroupsWithPaginator = async (
    agentId,
    agentVersion,
    region = "us-west-2",
) => {
    const client = new BedrockAgentClient({ region });

    // Create a paginator configuration
    const paginatorConfig = {
        client,
        pageSize: 10, // optional, added for demonstration purposes
    };

    const params = { agentId, agentVersion };

    const pages = paginateListAgentActionGroups(paginatorConfig, params);

    // Paginate until there are no more results
    const actionGroupSummaries = [];
    for await (const page of pages) {
        actionGroupSummaries.push(...page.actionGroupSummaries);
    }

    return actionGroupSummaries;
};

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    // Replace the placeholders for agentId and agentVersion with an existing agent's id and version.
    // Ensure to remove the brackets '[]' before adding your data.

    // The agentId must be an alphanumeric string with exactly 10 characters.
    const agentId = "0VPWAH32HO";

    // A string either containing `DRAFT` or a number with 1-5 digits (e.g., '123' or 'DRAFT').
    const agentVersion = "DRAFT";

    console.log("=".repeat(68));
    console.log(
        "Listing agent action groups using the paginateListAgents function:",
    );
    for (const actionGroup of await listAgentActionGroupsWithPaginator(
        agentId,
        agentVersion,
    )) {
        console.log(actionGroup);
    }
}

