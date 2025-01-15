
import { fileURLToPath } from "node:url";

import {
    BedrockAgentClient,
    CreateAgentCommand,
} from "@aws-sdk/client-bedrock-agent";

/**
 * Creates an Amazon Bedrock Agent.
 *
 * @param {string} agentName - A name for the agent that you create.
 * @param {string} foundationModel - The foundation model to be used by the agent you create.
 * @param {string} agentResourceRoleArn - The ARN of the IAM role with permissions required by the agent.
 * @param {string} [region='us-west-2'] - The AWS region in use.
 * @returns {Promise<import("@aws-sdk/client-bedrock-agent").Agent>} An object containing details of the created agent.
 */
export const createAgent = async (
    agentName,
    foundationModel,
    agentResourceRoleArn,
    region = "us-west-2",
) => {
    const client = new BedrockAgentClient({ region });

    const command = new CreateAgentCommand({
        agentName,
        foundationModel,
        agentResourceRoleArn,
    });
    const response = await client.send(command);

    return response.agent;
};

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    // Replace the placeholders for agentName and accountId, and roleName with a unique name for the new agent,
    // the id of your AWS account, and the name of an existing execution role that the agent can use inside your account.
    // For foundationModel, specify the desired model. Ensure to remove the brackets '[]' before adding your data.

    // A string (max 100 chars) that can include letters, numbers, dashes '-', and underscores '_'.
    const agentName = "[your-bedrock-agent-name]";

    // Your AWS account id.
    const accountId = "913870644571";

    // The name of the agent's execution role. It must be prefixed by `AmazonBedrockExecutionRoleForAgents_`.
    const roleName = "AmazonBedrockExecutionRoleForAgents_IM37FNC9G4";

    // The ARN for the agent's execution role.
    // Follow the ARN format: 'arn:aws:iam::account-id:role/role-name'
    const roleArn = `arn:aws:iam::${accountId}:role/${roleName}`;

    // Specify the model for the agent. Change if a different model is preferred.
    const foundationModel = "anthropic.claude-3-5-sonnet-20240620-v1:0";

    console.log("Creating a new agent...");

    const agent = await createAgent(agentName, foundationModel, roleArn);
    console.log(agent);
}

