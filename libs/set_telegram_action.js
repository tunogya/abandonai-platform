
import { fileURLToPath } from "node:url";

import {
    BedrockAgentClient,
    paginateListAgentActionGroups,
    GetAgentActionGroupCommand, UpdateAgentActionGroupCommand, CreateAgentActionGroupCommand,
} from "@aws-sdk/client-bedrock-agent";

const FUNCTION_SCHEMA = {
    "functions": [
        {
            "description": "Use this method to send text messages. On success, the sent Message is returned.",
            "name": "sendMessage",
            "parameters": {
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
                }
            },
            "requireConfirmation": "DISABLED"
        },
        {
            "description": "Use this method to send photos. On success, the sent Message is returned.",
            "name": "sendPhoto",
            "parameters": {
                "caption": {
                    "description": "Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing",
                    "required": false,
                    "type": "string"
                },
                "chat_id": {
                    "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
                    "required": true,
                    "type": "string"
                },
                "parse_mode": {
                    "description": "Mode for parsing entities in the photo caption. See formatting options for more details.",
                    "required": false,
                    "type": "string"
                },
                "photo": {
                    "description": "Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20.",
                    "required": true,
                    "type": "string"
                }
            },
            "requireConfirmation": "DISABLED"
        },
        {
            "description": "Use this method to send general files. On success, the sent Message is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.",
            "name": "sendDocument",
            "parameters": {
                "caption": {
                    "description": "Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing",
                    "required": false,
                    "type": "string"
                },
                "chat_id": {
                    "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
                    "required": true,
                    "type": "string"
                },
                "document": {
                    "description": "File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. ",
                    "required": true,
                    "type": "string"
                },
                "parse_mode": {
                    "description": "Mode for parsing entities in the document caption. ",
                    "required": false,
                    "type": "string"
                }
            },
            "requireConfirmation": "DISABLED"
        },
        {
            "description": "Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). On success, the sent Message is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.",
            "name": "sendVideo",
            "parameters": {
                "caption": {
                    "description": "Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing",
                    "required": false,
                    "type": "string"
                },
                "chat_id": {
                    "description": "Unique identifier for the target chat or username of the target channel (in the format @channelusername)",
                    "required": true,
                    "type": "string"
                },
                "parse_mode": {
                    "description": "Mode for parsing entities in the video caption.",
                    "required": false,
                    "type": "string"
                },
                "video": {
                    "description": "Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data.",
                    "required": true,
                    "type": "string"
                }
            },
            "requireConfirmation": "DISABLED"
        },
        {
            "description": "Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.",
            "name": "getFile",
            "parameters": {
                "file_id": {
                    "description": "File identifier to get information about",
                    "required": true,
                    "type": "string"
                }
            },
            "requireConfirmation": "DISABLED"
        }
    ]
}

/**
 * Retrieves a list of Action Groups of an agent utilizing the paginator function.
 *
 * This function leverages a paginator, which abstracts the complexity of pagination, providing
 * a straightforward way to handle paginated results inside a `for await...of` loop.
 *
 * @param {string} agentId - The unique identifier of the agent.
 * @param {string} agentVersion - The version of the agent.
 * @param {string} [region='us-west-2'] - The AWS region in use.
 * @returns {Promise<ActionGroupSummary[]>} An array of action group summaries.
 */
export const listAgentActionGroupsWithPaginator = async (
    agentId,
    agentVersion,
    region,
) => {
    const client = new BedrockAgentClient({ region });

    // Create a paginator configuration
    const paginatorConfig = {
        client,
        pageSize: 10, // optional, added for demonstration purposes
    };

    const params = { agentId, agentVersion };

    const pages = paginateListAgentActionGroups(paginatorConfig, params);

    // Paginate until there are no more results
    const actionGroupSummaries = [];
    for await (const page of pages) {
        actionGroupSummaries.push(...page.actionGroupSummaries);
    }

    return actionGroupSummaries;
};

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    // Replace the placeholders for agentId and agentVersion with an existing agent's id and version.
    // Ensure to remove the brackets '[]' before adding your data.

    // The agentId must be an alphanumeric string with exactly 10 characters.
    const agentId = "5WIQLLGEOS";

    // A string either containing `DRAFT` or a number with 1-5 digits (e.g., '123' or 'DRAFT').
    const agentVersion = "DRAFT";

    console.log("=".repeat(68));
    console.log(
        "Listing agent action groups using the paginateListAgents function:",
    );

    let actionGroups = [];
    for (const actionGroup of await listAgentActionGroupsWithPaginator(
        agentId,
        agentVersion,
    )) {
        actionGroups.push(actionGroup);
    }

    console.log("=".repeat(68));

    // 如果 actionGroups 存在一个 actionGroupName = "TelegramAction" 的对象
    const telegramAction = actionGroups.find(
        (actionGroup) => actionGroup.actionGroupName === "TelegramAction",
    )
    if (telegramAction) {
        const client = new BedrockAgentClient({ region: "us-west-2" });
        const { agentActionGroup } = await client.send(new GetAgentActionGroupCommand({
            agentId,
            agentVersion,
            actionGroupId: telegramAction.actionGroupId,
        }));
        const response = await client. send(new UpdateAgentActionGroupCommand({
            ...agentActionGroup,
            functionSchema: FUNCTION_SCHEMA,
        }));
        console.log(response);
        console.log("=".repeat(68));
    } else {
        console.log("TelegramAction not found");
        const client = new BedrockAgentClient({ region: "us-west-2" });
        // 新建一个TelegramAction 的 actionGroup
        await client.send(new CreateAgentActionGroupCommand({
            agentId,
            agentVersion,
            actionGroupName: "TelegramAction",
            functionSchema: FUNCTION_SCHEMA,
        }));
    }
}