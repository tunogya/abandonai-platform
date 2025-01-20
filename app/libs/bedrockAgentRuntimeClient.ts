import {BedrockAgentRuntimeClient} from "@aws-sdk/client-bedrock-agent-runtime";

const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient({ region: "us-west-2" });

export {bedrockAgentRuntimeClient}