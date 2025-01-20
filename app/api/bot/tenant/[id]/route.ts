import {NextRequest} from "next/server";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import {Redis} from "@upstash/redis";

const client = new BedrockAgentRuntimeClient({ region: "us-west-2" });

const redis = Redis.fromEnv()

const BOT_DEVELOPER = 2130493951;

const POST = async (req: NextRequest, {params}: never) => {
  const {id} = await params;
  const body = await req.json();
  if (body.message.chat.id !== BOT_DEVELOPER) {
    return Response.json({
      ok: false,
      msg: "Not Auth"
    })
  }

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
      inputText: `You received a message from Telegram. You can send a message or voice to user, if you think it is necessary: ${JSON.stringify({
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