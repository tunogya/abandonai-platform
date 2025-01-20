import {NextRequest} from "next/server";
import {InvokeAgentCommand,} from "@aws-sdk/client-bedrock-agent-runtime";
import {bedrockAgentRuntimeClient} from "@/app/libs/bedrockAgentRuntimeClient";
import {redisClient} from "@/app/libs/redisClient";
import {getFile, getFileAsStream} from "@/app/libs/telegram";
import {StartStreamTranscriptionCommand} from "@aws-sdk/client-transcribe-streaming";
import {transcribeStreamingClient} from "@/app/libs/transcribeStreamingClient";

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

    const [agentAliasId, botToken] = await Promise.all([
      redisClient.get(`agentAliasId:${agentId}`),
      redisClient.get(`telegrambottoken:${agentId}`)
    ]) as [string | undefined, string | undefined];

    if (!agentAliasId || !botToken) {
      return Response.json({
        ok: true,
        msg: "agentAliasId or botToken not found."
      });
    }

    body = {
      ...body,
      agent: {
        agent_id: agentId,
      }
    }

    // 判断是否是 voice message
    // 如果是 voice message，则需要先转成文字，再拼接到原来的 body 数据结构中
    if (body.message?.voice) {
      const file_id = body.message.voice.file_id;
      const audio_stream = await getFileAsStream(file_id, botToken);
      if (!audio_stream) {
        return Response.json({
          ok: true,
          msg: "file not found."
        });
      }
      try {
        const data = await transcribeStreamingClient.send(new StartStreamTranscriptionCommand({
          MediaEncoding: "pcm",
          MediaSampleRateHertz: 16000,
          IdentifyMultipleLanguages: true,
          LanguageOptions: "en-US,zh-CN,id-ID",
          AudioStream: (async function* () {
            for await (const chunk of audio_stream) {
              yield {AudioEvent: {AudioChunk: chunk}};
            }
          })(),
        }));
        if (!data?.TranscriptResultStream) {
          return Response.json({
            ok: true,
            msg: "TranscriptResultStream not found."
          });
        }
        let content = ""
        for await (const event of data.TranscriptResultStream) {
          for (const result of event.TranscriptEvent?.Transcript?.Results || []) {
            if (result.IsPartial === false) {
              if (result?.Alternatives && result?.Alternatives[0].Items) {
                const noOfResults = result?.Alternatives[0].Items.length;
                for (let i = 0; i < noOfResults; i++) {
                  content += result?.Alternatives[0].Items[i].Content || "";
                }
              }
            }
          }
        }
        body = {
          ...body,
          message: {
            ...body.message,
            text: content,
          },
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (body.message?.photo) {
      // https://aws.amazon.com/cn/blogs/china/amazon-bedrock-claude-3-multimodal-usage-guide/
      const photo = body.message.photo.find((photo: {width: number, height: number}) => photo.width <= 1568 && photo.height <= 1568 && photo.width > 200 && photo.height > 200);
      if (!photo) {
        return Response.json({
          ok: true,
          msg: "photo not found."
        });
      }
      const file_id = photo.file_id;
      const buffer =  await getFile(file_id, botToken)
      if (!buffer) {
        return Response.json({
          ok: true,
          msg: "file not found."
        });
      }
      const file_content_base64 = Buffer.from(buffer).toString('base64');
      body = {
        ...body,
        message: {
          ...body.message,
          photo: `data:image/jpeg;base64, ${file_content_base64}`,
        }
      }
    }

    console.log(JSON.stringify(body))
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
  } catch (error) {
    console.log("error", error);
    return Response.json({
      ok: true,
      msg: "Something went wrong."
    })
  }
};

export {POST}