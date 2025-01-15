import {NextRequest} from "next/server";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({ region: "us-east-1" });

const POST = async (req: NextRequest, {params}: never) => {
  const {id} = await params;
  const body = await req.json();

  console.log(body);

  const agentId = id;
  const command = new InvokeAgentCommand({
    agentId,
    agentAliasId: "DRAFT",
    sessionId: "default",
    inputText: `${JSON.stringify(body)}`,
  });
  await client.send(command);

  return Response.json({
    ok: true,
  });
};

export {POST}