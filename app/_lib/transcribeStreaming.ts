import {TranscribeStreamingClient} from "@aws-sdk/client-transcribe-streaming";

const transcribeStreamingClient = new TranscribeStreamingClient({ region: "us-west-2"});

export {transcribeStreamingClient}