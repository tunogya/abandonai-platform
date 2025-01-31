import {
  BedrockAgentClient, CreateAgentActionGroupCommand,
  GetAgentActionGroupCommand,
  UpdateAgentActionGroupCommand
} from "@aws-sdk/client-bedrock-agent";
import {listAgentActionGroupsWithPaginator} from "@/app/api/bot/platform/telegram_action";
import {LAWYER_FUNCTION_SCHEMA} from "@/app/api/bot/platform/function_schema/lawyer";

export const updateLawyerAction = async (agentId: string, bedrockAgentClient: BedrockAgentClient) => {
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
    (actionGroup) => actionGroup.actionGroupName === "LawyerAction",
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
        functionSchema: LAWYER_FUNCTION_SCHEMA,
      }));
    }
  } else {
    await bedrockAgentClient.send(new CreateAgentActionGroupCommand({
      agentId,
      agentVersion: "DRAFT",
      actionGroupName: "LawyerAction",
      description: "",
      functionSchema: LAWYER_FUNCTION_SCHEMA,
      actionGroupExecutor: {
        lambda: ''
      }
    }));
  }
}
