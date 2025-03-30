import { LambdaClient } from "@aws-sdk/client-lambda";

const client = new LambdaClient({ region: "us-west-2" });

export default client;