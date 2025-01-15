import { fileURLToPath } from "node:url";

import {
    BedrockAgentClient, CreateAgentAliasCommand,
} from "@aws-sdk/client-bedrock-agent";

export const createAgentAlias = async (
    agentId,
    agentAliasName,
    region = "us-west-2",
) => {
    const client = new BedrockAgentClient({ region });
    const {agentAlias} = await client.send(new CreateAgentAliasCommand({
        agentId: agentId,
        agentAliasName: agentAliasName,
    }))
    return agentAlias;
};

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const name = new Date().getTime().toString();
    const agent = await createAgentAlias("SSEKAGMNUC", name);
    console.log(agent);
}

