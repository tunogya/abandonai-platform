import {NextRequest} from "next/server";
import {
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import {bedrockAgentRuntimeClient} from "@/app/libs/bedrockAgentRuntimeClient";
import {redisClient} from "@/app/libs/redisClient";
// import {StartTranscriptionJobCommand} from "@aws-sdk/client-transcribe";
// import {transcribeClient} from "@/app/libs/transcribeClient";

const BOT_DEVELOPER = 2130493951;

const POST = async (req: NextRequest, {params}: never) => {
  const {id} = await params;
  let body = await req.json();
  if (body.message.chat.id !== BOT_DEVELOPER) {
    return Response.json({
      ok: false,
      msg: "Not Auth"
    })
  }
  try {
    // 先检查是否有绑定的 agentAliasId
    const agentId = id;
    const agentAliasId = await redisClient.get(`agentAliasId:${agentId}`) as string | undefined;
    if (!agentAliasId) {
      return Response.json({
        ok: false,
        msg: "agentAliasId not found."
      }, {
        status: 404,
      });
    }
    body = {
      ...body,
      agent: {
        agent_id: id,
      }
    }
    // 判断是否是 voice message
    // 如果是 voice message，则需要先转成文字，再拼接到原来的 body 数据结构中
    console.log(body);
    // const data = await transcribeClient.send(
    //   new StartTranscriptionJobCommand({
    //     TranscriptionJobName: "JOB_NAME",
    //     LanguageCode: "en-US", // For example,
    //     MediaFormat: "ogg", // For example, 'wav'
    //     Media: {
    //       MediaFileUri: "SOURCE_LOCATION",
    //     },
    //     OutputBucketName: "OUTPUT_BUCKET_NAME",
    //   }),
    // );
    // console.log("Success - put", data);

    const command = new InvokeAgentCommand({
      agentId,
      agentAliasId: agentAliasId,
      sessionId: body.message.chat.id,
      inputText: `You received a message from Telegram. You can send a message or voice to user, if you think it is necessary: ${JSON.stringify(body)}`,
    });
    await bedrockAgentRuntimeClient.send(command);
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