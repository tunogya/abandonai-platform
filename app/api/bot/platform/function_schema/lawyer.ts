import {FunctionSchema} from "@aws-sdk/client-bedrock-agent/dist-types/models/models_0";

export const LAWYER_FUNCTION_SCHEMA = {
  "functions": [
    {
      "description": "New case",
      "name": "newCase",
      "parameters": {
        "chat_id": {
          "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
          "required": true,
          "type": "string"
        },
        "title": {
          "description": "",
          "required": true,
          "type": "string"
        },
        "description": {
          "description": "",
          "required": true,
          "type": "string"
        },
        "case_type": {
          "description": "",
          "required": true,
          "type": "string"
        },
        "status": {
          "description": "",
          "required": true,
          "type": "string"
        }
      },
      "requireConfirmation": "DISABLED"
    },
    {
      "description": "Get cases by client id",
      "name": "getCases",
      "parameters": {
        "chat_id": {
          "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
          "required": true,
          "type": "string"
        }
      },
      "requireConfirmation": "DISABLED"
    },
    {
      "description": "Get case by id",
      "name": "getCase",
      "parameters": {
        "case_id": {
          "description": "",
          "required": true,
          "type": "string"
        }
      },
      "requireConfirmation": "DISABLED"
    },
    {
      "description": "Update case progress",
      "name": "updateCaseProgress",
      "parameters": {
        "case_id": {
          "description": "",
          "required": true,
          "type": "string"
        },
        "progress": {
          "description": "",
          "required": true,
          "type": "string"
        }
      },
      "requireConfirmation": "DISABLED"
    },
    {
      "name": "newCaseEvent",
      "description": "Create a new case progress event.",
      "parameters": {
        "case_id": {
          "description": "The id of the case.",
          "required": true,
          "type": "string"
        },
        "event_type": {
          "description": "The type of the case.",
          "required": true,
          "type": "string"
        },
        "notes": {
          "description": "The progress of the case.",
          "required": true,
          "type": "string"
        }
      },
      "requireConfirmation": "DISABLED"
    }
  ]
} as FunctionSchema