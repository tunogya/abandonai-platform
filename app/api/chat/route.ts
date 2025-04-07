import { streamText } from 'ai';
import {createXai} from "@ai-sdk/xai";

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: xai("grok-2-1212", {
      user: "",
    }),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}