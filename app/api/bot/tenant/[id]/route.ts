import {NextRequest} from "next/server";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({ region: "us-east-1" });

const POST = async (req: NextRequest, {params}: never) => {
  const {id} = await params;
  const body = await req.json();
  try {
    const agentId = id;
    const command = new InvokeAgentCommand({
      agentId,
      agentAliasId: "DRAFT",
      sessionId: body.message.chat.id,
      inputText: `${JSON.stringify({
        ...body,
        agent: {
          agent_id: id,
        }
      })}`,
    });
    await client.send(command);

    return Response.json({
      ok: true,
    });
  } catch {
    return Response.json({
      ok: false,
      msg: "Something went wrong."
    }, {
      status: 500,
    })
  }
};

export {POST}