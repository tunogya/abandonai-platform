import {Redis} from "@upstash/redis";
import {TwitterApi} from "twitter-api-v2";
import {NextRequest} from "next/server";
import {Bot} from "grammy";

const redis = Redis.fromEnv();
const twitterClient = new TwitterApi({
  clientId: process.env.X_CLIENT_ID || "",
  clientSecret: process.env.X_CLIENT_SECRET || ""
});
const token = process.env.TELEGRAM_BOT_TOKEN || ""
const bot = new Bot(token)

const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const {codeVerifier, state: stateVerifier, chatId, messageId} = await redis.get(`oauth2:${state}`) as {
    codeVerifier: string,
    state: string,
    chatId: string | number,
    messageId: number,
  };
  if (!code || !state || state !== stateVerifier) {
    return Response.json({message: 'error'});
  }
  const response = await twitterClient.loginWithOAuth2({
    code: `${code}`, codeVerifier, redirectUri: "https://open.abandon.ai/api/callback/twitter",
  })
  const {client: loggedClient, accessToken, refreshToken, expiresIn} = response;
  const {data: userObject} = await loggedClient.v2.me();
  await redis.set(`twitterbotauth2:${state}`, {accessToken, refreshToken, expiresIn, userObject});
  await bot.api.editMessageText(chatId, messageId, `This agent have login with <a href="https://x.com/${userObject.username}">${userObject.name}</a>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
      ]
    }
  })

  return Response.redirect("https://t.me/abandonaibot", 302);
}

export {GET}