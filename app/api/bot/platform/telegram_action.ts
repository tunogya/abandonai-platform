import {listAgentActionGroupsWithPaginator} from "@/libs/set_telegram_action";
import {
  BedrockAgentClient,
  CreateAgentActionGroupCommand, DeleteAgentActionGroupCommand,
  GetAgentActionGroupCommand,
  UpdateAgentActionGroupCommand
} from "@aws-sdk/client-bedrock-agent";
import {TELEGRAM_FUNCTION_SCHEMA} from "@/app/api/bot/platform/function_schema/telegram";

export const updateTelegramAction = async (agentId: string, bedrockAgentClient: BedrockAgentClient) => {
  // 设置 agent 的 Telegram Action
  const actionGroups = [];
  for (const actionGroup of await listAgentActionGroupsWithPaginator(
    agentId,
    "DRAFT",
  )) {
    actionGroups.push(actionGroup);
  }
  const telegramAction = actionGroups.find(
    (actionGroup) => actionGroup.actionGroupName === "TelegramAction",
  )
  if (telegramAction) {
    const {agentActionGroup} = await bedrockAgentClient.send(new GetAgentActionGroupCommand({
      agentId,
      agentVersion: "DRAFT",
      actionGroupId: telegramAction.actionGroupId,
    }));
    if (agentActionGroup) {
      await bedrockAgentClient.send(new UpdateAgentActionGroupCommand({
        ...agentActionGroup,
        functionSchema: TELEGRAM_FUNCTION_SCHEMA,
      }));
    }
  } else {
    await bedrockAgentClient.send(new CreateAgentActionGroupCommand({
      agentId,
      agentVersion: "DRAFT",
      actionGroupName: "TelegramAction",
      description: "Only when you want send message to Telegram users, you can use this API.",
      functionSchema: TELEGRAM_FUNCTION_SCHEMA,
      actionGroupExecutor: {
        lambda: 'arn:aws:lambda:us-east-1:913870644571:function:TelegramAction-sva3u'
      }
    }));
  }
}

export const deleteTelegramAction = async (agentId: string, bedrockAgentClient: BedrockAgentClient) => {
  const actionGroups = [];
  for (const actionGroup of await listAgentActionGroupsWithPaginator(
    agentId,
    "DRAFT",
  )) {
    actionGroups.push(actionGroup);
  }
  const telegramAction = actionGroups.find(
    (actionGroup) => actionGroup.actionGroupName === "TelegramAction",
  )
  if (telegramAction) {
    await bedrockAgentClient.send(new DeleteAgentActionGroupCommand({
      agentId,
      agentVersion: "DRAFT",
      actionGroupId: telegramAction.actionGroupId,
      skipResourceInUseCheck: true,
    }))
  }
}