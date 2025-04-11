import { streamText } from 'ai';
import {createXai} from "@ai-sdk/xai";
import {verifyToken} from "@/app/_lib/jwt";
import {unauthorized} from "next/navigation";

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(req: Request) {
  let session;
  try {
    session = await verifyToken(req.headers.get("authorization")?.split(" ")?.[1]);
  } catch {
    unauthorized()
  }
  const { messages } = await req.json();

  const result = streamText({
    model: xai("grok-2-1212", {
      user: session.sub,
    }),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}