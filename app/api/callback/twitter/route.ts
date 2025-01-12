import {NextApiRequest} from "next";
import {Redis} from "@upstash/redis";
import {TwitterApi} from "twitter-api-v2";

const redis = Redis.fromEnv();
const twitterClient = new TwitterApi({ clientId: process.env.X_CLIENT_ID || "", clientSecret: process.env.X_CLIENT_SECRET || "" });

const GET = async (req: NextApiRequest) => {
  const { state, code } = req.query;
  const response = await twitterClient.loginWithOAuth2({
    code: `${code}`, codeVerifier: "challenge", redirectUri: "https://t.me/abandonaibot",
  })
  const {client: loggedClient, accessToken, refreshToken, expiresIn} = response;
  const { data: userObject } = await loggedClient.v2.me();
  await redis.set(`twitterbotauth2:${state}`, {accessToken, refreshToken, expiresIn, userObject});
  return Response.json({message: 'success', userObject, accessToken, refreshToken, expiresIn});
}

export {GET}