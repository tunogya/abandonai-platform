import {FunctionSchema} from "@aws-sdk/client-bedrock-agent/dist-types/models/models_0";

export const TELEGRAM_FUNCTION_SCHEMA = {
  "functions": [
    {
      "description": "Use this method to send text messages.",
      "name": "sendMessage",
      "parameters": {
        "agent_id": {
          "description": "The id of agent for this telegram bot.",
          "required": true,
          "type": "string"
        },
        "chat_id": {
          "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
          "required": true,
          "type": "string"
        },
        "parse_mode": {
          "description": "Mode for parsing entities in the message text. Options: Markdown, MarkdownV2, HTML.",
          "required": false,
          "type": "string"
        },
        "text": {
          "description": "Text of the message to be sent, 1-4096 characters after entities parsing",
          "required": true,
          "type": "string"
        },
      },
      "requireConfirmation": "DISABLED"
    },
    {
      "description": "Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message.",
      "name": "sendVoice",
      "parameters": {
        "agent_id": {
          "description": "The id of agent for this telegram bot.",
          "required": true,
          "type": "string"
        },
        "chat_id": {
          "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
          "required": true,
          "type": "string"
        },
        "text": {
          "description": "Text of the voice to be generated.",
          "required": true,
          "type": "string"
        },
      },
      "requireConfirmation": "DISABLED"
    },
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
    // {
    //   "description": "Use this method to send photos. On success, the sent Message is returned.",
    //   "name": "sendPhoto",
    //   "parameters": {
    //     "agent_id": {
    //       "description": "The id of agent for this telegram bot.",
    //       "required": true,
    //       "type": "string"
    //     },
    //     "chat_id": {
    //       "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
    //       "required": true,
    //       "type": "string"
    //     },
    //     "photo": {
    //       "description": "Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20.",
    //       "required": true,
    //       "type": "string"
    //     },
    //   },
    //   "requireConfirmation": "DISABLED"
    // },
    // {
    //   "description": "Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.",
    //   "name": "sendDocument",
    //   "parameters": {
    //     "agent_id": {
    //       "description": "The id of agent for this telegram bot.",
    //       "required": true,
    //       "type": "string"
    //     },
    //     "chat_id": {
    //       "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
    //       "required": true,
    //       "type": "string"
    //     },
    //     "document": {
    //       "description": "File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. ",
    //       "required": true,
    //       "type": "string"
    //     },
    //   },
    //   "requireConfirmation": "DISABLED"
    // },
    // {
    //   "description": "Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.",
    //   "name": "sendVideo",
    //   "parameters": {
    //     "agent_id": {
    //       "description": "The id of agent for this telegram bot.",
    //       "required": true,
    //       "type": "string"
    //     },
    //     "chat_id": {
    //       "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
    //       "required": true,
    //       "type": "string"
    //     },
    //     "video": {
    //       "description": "Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data.",
    //       "required": true,
    //       "type": "string"
    //     }
    //   },
    //   "requireConfirmation": "DISABLED"
    // },
    // {
    //   "description": "Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.",
    //   "name": "getFile",
    //   "parameters": {
    //     "agent_id": {
    //       "description": "The id of agent for this telegram bot.",
    //       "required": true,
    //       "type": "string"
    //     },
    //     "file_id": {
    //       "description": "File identifier to get information about",
    //       "required": true,
    //       "type": "string"
    //     }
    //   },
    //   "requireConfirmation": "DISABLED"
    // }
  ]
} as FunctionSchema