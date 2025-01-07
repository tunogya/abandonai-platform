export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import {Bot, Context, webhookCallback} from 'grammy'
import {Redis} from '@upstash/redis'
import {
  BedrockAgentClient,
  CreateAgentCommand,
  DeleteAgentCommand, GetAgentCommand,
  paginateListAgents
} from "@aws-sdk/client-bedrock-agent";
import {InlineKeyboardButton, KeyboardButton} from "@grammyjs/types";

const BOT_DEVELOPER = 2130493951;

// Define custom context type.
interface BotConfig {
  botDeveloper: number;
  isDeveloper: boolean;
}

type MyContext = Context & {
  config: BotConfig;
};

const token = process.env.TELEGRAM_BOT_TOKEN

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')

const bot = new Bot<MyContext>(token)

const redis = Redis.fromEnv()

const bedrockAgentClient = new BedrockAgentClient({region: "us-east-1"});

/**
 * Middleware to add bot config to context.
 */
bot.use(async (ctx, next) => {
  ctx.config = {
    botDeveloper: BOT_DEVELOPER,
    isDeveloper: ctx.from?.id === BOT_DEVELOPER,
  };
  await next();
});

/**
 * command - start
 */
bot.command("start", async (ctx) => {
  // await redis.del(`params:${ctx.from?.id}`);
  // const payload = ctx.match
  await ctx.reply(`I can help you create and manage Agents\\.

You can control me by sending these commands:
/newagent \\- create a new agent
/myagents \\- edit your agents

*Edit Agents*
/deleteagent \\- delete a agent

*Agent Settings*

*Knowledge bases*
`, {
    parse_mode: "MarkdownV2"
  });
});

/**
 * command - newagent
 */

bot.command("newagent", async (ctx) => {
  if (!ctx.config.isDeveloper) {
    await ctx.reply("You are not authorized to create a new agent.");
    return;
  }
  await redis.set(`params:${ctx.from?.id}`, ["newagent"]);
  await ctx.reply("Alright, a new agent. How are we going to call it? Please choose a name for your agent.");
})

/**
 * command - myagents
 */

bot.command("myagents", async (ctx) => {
  if (!ctx.config.isDeveloper) {
    await ctx.reply("You are not authorized to create a new agent.");
    return;
  }
  await redis.set(`params:${ctx.from?.id}`, ["myagents"]);
  const pages = paginateListAgents({
    client: bedrockAgentClient,
    pageSize: 10,
  }, {});
  const agents = [];
  for await (const page of pages) {
    agents.push(...(page.agentSummaries || []));
  }
  // 准备 inline_keyboard
  const inlineKeyboard = agents.map((agent) => {
    return {
      text: agent.agentName,
      callback_data: `agent:${agent.agentId}`,
    } as InlineKeyboardButton;
  })
  // 每行 2 个
  const inlineKeyboardRows = [] as InlineKeyboardButton[][];
  for (let i = 0; i < inlineKeyboard.length; i += 2) {
    inlineKeyboardRows.push(inlineKeyboard.slice(i, i + 2));
  }
  await ctx.reply("Choose an agent from the list below:", {
    reply_markup: {
      inline_keyboard: inlineKeyboardRows,
    }
  });
})

/**
 * Edit Agent
 */

/**
 * command - deleteagent
 */

bot.command("deleteagent", async (ctx) => {
  if (!ctx.config.isDeveloper) {
    await ctx.reply("You are not authorized to create a new agent.");
    return;
  }
  await redis.set(`params:${ctx.from?.id}`, ["deleteagent"]);
  const pages = paginateListAgents({
    client: bedrockAgentClient,
    pageSize: 10,
  }, {});
  const agents = [];
  for await (const page of pages) {
    agents.push(...(page.agentSummaries || []));
  }
  // Prepare keyboard buttons
  const keyboard = agents.map((agent) => {
    return [agent.agentName] as KeyboardButton[];
  });
  await ctx.reply("Choose a agent to delete.", {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
})

bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;
  if (data.startsWith("agent:")) {
    await ctx.answerCallbackQuery();
    const agentId = data.split(":")[1];
    const response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
    if (!response.agent) {
      await ctx.reply("Failed to get agent.");
      return;
    }
    await ctx.reply(`Here it is: ${response.agent.agentName}
AgentId: ${response.agent.agentId}
AgentStatus: ${response.agent.agentStatus}
FoundationModel: ${response.agent.foundationModel}
AgentVersion: ${response.agent.agentVersion}

What do you want to do with the bot?`, {
      reply_markup: {
        inline_keyboard: [
          [
            {text: "New Version", callback_data: `newversion:${agentId}`},
            {
              text: "Edit Agent",
              callback_data: `editagent:${agentId}`
            }
          ],
          [{text: "Agent Settings", callback_data: `agentsettings:${agentId}`}, {text: "Delete Agent", callback_data: `deleteagent:${agentId}`}],
          [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
        ]
      }
    })
    return
  }
  if (data.startsWith("editagent:")) {
    await ctx.answerCallbackQuery();
    const agentId = data.split(":")[1];
    const response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
    if (!response.agent) {
      await ctx.reply("Failed to get agent.");
      return;
    }
    await ctx.reply(`Edit agent ${response.agent.agentName} info.

*Name*: ${response.agent.agentName}
*Description*: ${response.agent.description}
*Instruction*: ${response.agent.instruction}

    `, {
      parse_mode: "Markdown"
    })
  }
  if (data.startsWith("deleteagent:")) {
    await ctx.answerCallbackQuery();
    // const agentId = data.split(":")[1];
  }
  if (data.startsWith("backtoagentlist")) {
    await ctx.answerCallbackQuery();
  }
  if (data.startsWith("newversion:")) {
    await ctx.answerCallbackQuery();
    // const agentId = data.split(":")[1];
  }
  if (data.startsWith("agentsettings:")) {
    await ctx.answerCallbackQuery();
    // const agentId = data.split(":")[1];
  }
});

bot.on("message", async (ctx) => {
  const params = await redis.get(`params:${ctx.from?.id}`) as string[] | undefined;
  if (!params) return;
  try {
    if (params[0] === "newagent") {
      if (params.length === 1) {
        // 首次输入参数，第一个参数为name
        const agentName = ctx.message.text;
        if (!agentName) {
          await ctx.reply("Please choose a name for your agent.");
          return;
        }
        // Your AWS account id.
        const accountId = "913870644571";
        // The name of the agent's execution role. It must be prefixed by `AmazonBedrockExecutionRoleForAgents_`.
        const roleName = "AmazonBedrockExecutionRoleForAgents_IM37FNC9G4";
        // The ARN for the agent's execution role.
        // Follow the ARN format: 'arn:aws:iam::account-id:role/role-name'
        const roleArn = `arn:aws:iam::${accountId}:role/${roleName}`;
        const response = await bedrockAgentClient.send(new CreateAgentCommand({
          agentName: agentName,
          // TODO: pick model
          foundationModel: "anthropic.claude-3-5-sonnet-20240620-v1:0",
          agentResourceRoleArn: roleArn,
        }));
        if (!response.agent) {
          await ctx.reply("Failed to create agent.");
          return;
        } else {
          await redis.del(`params:${ctx.from?.id}`);
          await ctx.reply(`Agent created successfully.

AgentId: ${response.agent.agentId}
AgentName: ${response.agent.agentName}
AgentStatus: ${response.agent.agentStatus}
FoundationModel: ${response.agent.foundationModel}
`)
        }
      }
    }
    if (params[0] === "deleteagent") {
      if (params.length === 1) {
        const agentId = ctx.message.text;
        const response = await bedrockAgentClient.send(new DeleteAgentCommand({agentId}));
        await redis.del(`params:${ctx.from?.id}`);
        await ctx.reply(`Agent deleted successfully.

AgentId: ${response.agentId}
AgentStatus: ${response.agentStatus}
`)
      }
    }
  } catch (e) {
    console.log(e)
  }
})

/**
 * Agent Settings
 *
 * command -
 */

/**
 * Knowledge bases
 */



export const POST = webhookCallback(bot, 'std/http')