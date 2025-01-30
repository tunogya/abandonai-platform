import {
  BedrockAgentClient, CreateAgentActionGroupCommand,
  GetAgentActionGroupCommand,
  UpdateAgentActionGroupCommand
} from "@aws-sdk/client-bedrock-agent";
import {listAgentActionGroupsWithPaginator} from "@/app/api/bot/platform/telegram_action";
import {BASIC_FUNCTION_SCHEMA} from "@/app/api/bot/platform/function_schema/basic";

export const updateBasicAction = async (agentId: string, bedrockAgentClient: BedrockAgentClient) => {
  // 设置 agent 的 Basic Action
  const actionGroups = [];
  for (const actionGroup of await listAgentActionGroupsWithPaginator(
    agentId,
    "DRAFT",
    bedrockAgentClient,
  )) {
    actionGroups.push(actionGroup);
  }
  const telegramAction = actionGroups.find(
    (actionGroup) => actionGroup.actionGroupName === "BasicAction",
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
        functionSchema: BASIC_FUNCTION_SCHEMA,
      }));
    }
  } else {
    await bedrockAgentClient.send(new CreateAgentActionGroupCommand({
      agentId,
      agentVersion: "DRAFT",
      actionGroupName: "BasicAction",
      description: "Some basic action for agent, like view photo.",
      functionSchema: BASIC_FUNCTION_SCHEMA,
      actionGroupExecutor: {
        lambda: 'arn:aws:lambda:us-west-2:913870644571:function:BasicAction-jv0e4'
      }
    }));
  }
}
