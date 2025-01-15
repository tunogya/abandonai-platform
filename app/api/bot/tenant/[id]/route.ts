import {NextRequest} from "next/server";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import {Redis} from "@upstash/redis";

const client = new BedrockAgentRuntimeClient({ region: "us-east-1" });

const redis = Redis.fromEnv()

const POST = async (req: NextRequest, {params}: never) => {
  const {id} = await params;
  const body = await req.json();
  try {
    const agentId = id;
    const agentAliasId = await redis.get(`agentAliasId:${agentId}`) as string | undefined;
    if (!agentAliasId) {
      return Response.json({
        ok: false,
        msg: "agentAliasId not found."
      }, {
        status: 404,
      })
    }
    const command = new InvokeAgentCommand({
      agentId,
      agentAliasId: agentAliasId,
      sessionId: body.message.chat.id,
      inputText: `You received a message from Telegram, if you think it is necessary to reply, you can reply to the user: ${JSON.stringify({
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