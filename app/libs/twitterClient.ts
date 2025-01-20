import {TwitterApi} from 'twitter-api-v2';

const twitterClient = new TwitterApi({
  clientId: process.env.X_CLIENT_ID || "",
  clientSecret: process.env.X_CLIENT_SECRET || "",
});

export {twitterClient}