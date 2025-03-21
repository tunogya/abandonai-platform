import {
  BedrockAgentClient
} from "@aws-sdk/client-bedrock-agent";

const bedrockAgentClient = new BedrockAgentClient({ region: "us-west-2" });

export {bedrockAgentClient}