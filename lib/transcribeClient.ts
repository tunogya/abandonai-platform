import {TranscribeClient} from "@aws-sdk/client-transcribe";

const transcribeClient = new TranscribeClient({ region: "us-west-2" });

export {transcribeClient}