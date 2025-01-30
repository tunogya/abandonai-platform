import {FunctionSchema} from "@aws-sdk/client-bedrock-agent/dist-types/models/models_0";

export const PSYCHOLOGY_FUNCTION_SCHEMA = {
  "functions": [
    {
      "description": "Create a new treatment record.",
      "name": "newTreatmentRecord",
      "parameters": {
        "user_id": {
          "description": "The id of the user.",
          "required": true,
          "type": "string"
        },
        "notes": {
          "description": "Treatment records.",
          "required": true,
          "type": "string"
        },
        "attachments": {
          "description": "Array of links.",
          "required": false,
          "type": "array"
        }
      },
      "requireConfirmation": "DISABLED"
    },
    {
      "description": "Get treatment records by patient ID.",
      "name": "getTreatmentRecords",
      "parameters": {
        "user_id": {
          "description": "The id of the user.",
          "required": true,
          "type": "string"
        },
      },
      "requireConfirmation": "DISABLED"
    }
  ]
} as FunctionSchema