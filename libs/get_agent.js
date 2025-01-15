
import { fileURLToPath } from "node:url";

import {
    BedrockAgentClient,
    GetAgentCommand,
} from "@aws-sdk/client-bedrock-agent";

/**
 * Retrieves the details of an Amazon Bedrock Agent.
 *
 * @param {string} agentId - The unique identifier of the agent.
 * @param {string} [region='us-west-2'] - The AWS region in use.
 * @returns {Promise<import("@aws-sdk/client-bedrock-agent").Agent>} An object containing the agent details.
 */
export const getAgent = async (agentId, region = "us-west-2") => {
    const client = new BedrockAgentClient({ region });

    const command = new GetAgentCommand({ agentId });
    const response = await client.send(command);
    return response.agent;
};

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    // Replace the placeholders for agentId with an existing agent's id.
    // Ensure to remove the brackets '[]' before adding your data.

    // The agentId must be an alphanumeric string with exactly 10 characters.
    const agentId = "0VPWAH32HO";

    console.log(`Retrieving agent with ID ${agentId}...`);

    const agent = await getAgent(agentId);
    console.log(agent);
}

