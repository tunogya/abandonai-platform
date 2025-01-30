import {
  BedrockAgentClient,
  CreateAgentActionGroupCommand, DeleteAgentActionGroupCommand,
  GetAgentActionGroupCommand, paginateListAgentActionGroups,
  UpdateAgentActionGroupCommand
} from "@aws-sdk/client-bedrock-agent";
import {TELEGRAM_FUNCTION_SCHEMA} from "@/app/api/bot/platform/function_schema/telegram";

export const listAgentActionGroupsWithPaginator = async (
  agentId: string,
  agentVersion: string,
  client: BedrockAgentClient,
) => {
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
    if (page.actionGroupSummaries) {
      actionGroupSummaries.push(...page.actionGroupSummaries)
    }
  }
  return actionGroupSummaries;
};

export const updateTelegramAction = async (agentId: string, bedrockAgentClient: BedrockAgentClient) => {
  // 设置 agent 的 Telegram Action
  const actionGroups = [];
  for (const actionGroup of await listAgentActionGroupsWithPaginator(
    agentId,
    "DRAFT",
    bedrockAgentClient,
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
      description: "Some API in Telegram, like sendMessage, sendVoice, or viewPhoto...",
      functionSchema: TELEGRAM_FUNCTION_SCHEMA,
      actionGroupExecutor: {
        lambda: 'arn:aws:lambda:us-west-2:913870644571:function:TelegramAction-otlfn'
      }
    }));
  }
}

export const deleteTelegramAction = async (agentId: string, bedrockAgentClient: BedrockAgentClient) => {
  const actionGroups = [];
  for (const actionGroup of await listAgentActionGroupsWithPaginator(
    agentId,
    "DRAFT",
    bedrockAgentClient,
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