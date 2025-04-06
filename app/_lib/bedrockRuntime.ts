import {
  BedrockRuntimeClient,
} from "@aws-sdk/client-bedrock-runtime";

const bedrockRuntimeClient = new BedrockRuntimeClient({ region: "us-west-2" });

export {bedrockRuntimeClient}