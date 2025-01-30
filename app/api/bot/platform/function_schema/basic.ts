import {FunctionSchema} from "@aws-sdk/client-bedrock-agent/dist-types/models/models_0";

export const BASIC_FUNCTION_SCHEMA = {
  "functions": [
    {
      "description": "Retrieves and analyzes a photo based on the specified prompt. Returns a text response upon success.",
      "name": "viewPhoto",
      "parameters": {
        "photo_uri": {
          "description": "The URI of the photo to be processed.",
          "required": true,
          "type": "string"
        },
        "prompt": {
          "description": "Defines the type of analysis (e.g., image understanding, text recognition) and the desired output format.",
          "required": true,
          "type": "string"
        }
      },
      "requireConfirmation": "DISABLED"
    }
  ]
} as FunctionSchema