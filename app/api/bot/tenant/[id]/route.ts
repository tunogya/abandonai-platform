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
      agentAliasId: "LNHNOEUNXM",
      sessionId: body.message.chat.id,
      inputText: `You received a message from Telegram, if you think it is necessary to reply, you can reply to the user: ${JSON.stringify({
        ...body,
        agent: {
          agent_id: id,
        }
      })}`,
    });
    const response = await client.send(command);
    console.log(response);
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