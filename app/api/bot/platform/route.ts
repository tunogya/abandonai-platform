import {Bot, Context, webhookCallback} from 'grammy'
import {
  CreateAgentAliasCommand,
  CreateAgentCommand, DeleteAgentAliasCommand,
  DeleteAgentCommand, GetAgentCommand,
  paginateListAgents, PrepareAgentCommand, UpdateAgentCommand
} from "@aws-sdk/client-bedrock-agent";
import {InlineKeyboardButton, KeyboardButton} from "@grammyjs/types";
import {deleteTelegramAction, updateTelegramAction} from "@/app/api/bot/platform/telegram_action";
import {bedrockAgentClient} from "@/app/libs/bedrockAgentClient";
import {redisClient} from "@/app/libs/redisClient";
import {twitterClient} from "@/app/libs/twitterClient";
import {updateBasicAction} from "@/app/api/bot/platform/basic_action";
import {updatePsychologyAction} from "@/app/api/bot/platform/psychology";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

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
  await ctx.reply(`I can help you create and manage Agents.

You can control me by sending these commands:
/newagent - create a new agent
/myagents - edit your agents

<b>Edit Agents</b>
/deleteagent - delete a agent

<b>Agent Settings</b>

<b>Knowledge bases</b>
`, {
    parse_mode: "HTML"
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
  await Promise.all([
    redisClient.set(`params:${ctx.from?.id}`, ["newagent"]),
    ctx.reply("Alright, a new agent. How are we going to call it? Please choose a name for your agent.")
  ])
})

/**
 * command - myagents
 */

bot.command("myagents", async (ctx) => {
  if (!ctx.config.isDeveloper) {
    await ctx.reply("You are not authorized to create a new agent.");
    return;
  }
  await redisClient.set(`params:${ctx.from?.id}`, ["myagents"]);
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
  await redisClient.set(`params:${ctx.from?.id}`, ["deleteagent"]);
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
    const agentId = data.split(":")[1];
    let response;
    try {
      response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
    } catch {
      response = {
        agent: null
      }
    }
    if (!response.agent) {
      await ctx.editMessageText("Failed to get agent.", {
        reply_markup: {
          inline_keyboard: [
            [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
          ]
        }
      }).catch((e) => console.log(e));
      return;
    }
    await ctx.editMessageText(`Here it is: ${response.agent.agentName}

<b>AgentId:</b> ${response.agent.agentId}
<b>AgentStatus:</b> ${response.agent.agentStatus}
<b>FoundationModel:</b> ${response.agent.foundationModel}

What do you want to do with the bot?`, {
      reply_markup: {
        inline_keyboard: [
          [
            {text: "Prepare Agent", callback_data: `prepareagent:${response.agent.agentId}`},
            {
              text: "Edit Agent",
              callback_data: `editagent:${response.agent.agentId}`
            }
          ],
          [{text: "Agent Settings", callback_data: `agentsettings:${response.agent.agentId}`}, {
            text: "Delete Agent",
            callback_data: `deleteagent:${response.agent.agentId}`
          }],
          [{text: "New Version", callback_data: `newversion:${response.agent.agentId}`}],
          [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
        ]
      },
      parse_mode: "HTML"
    }).catch((e) => console.log(e));
    return
  }
  if (data.startsWith("editagent:")) {
    const agentId = data.split(":")[1];
    let response;
    try {
      response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
    } catch {
      response = {
        agent: null
      }
    }
    if (!response.agent) {
      await ctx.editMessageText("Failed to get agent.", {
        reply_markup: {
          inline_keyboard: [
            [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
          ]
        }
      }).catch((e) => console.log(e));
      return;
    }
    const voice = await redisClient.get(`voice:${agentId}`);
    await ctx.editMessageText(`Edit agent ${response.agent.agentName} info.

<b>Name:</b> ${response.agent.agentName}
<b>Description:</b> ${response.agent.description}
<b>Instruction:</b> ${response.agent.instruction}
<b>Voice:</b> ${voice || "NULL"}
`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Edit Name", callback_data: `editname:${response.agent.agentId}`}, {
            text: "Edit Description",
            callback_data: `editdescription:${response.agent.agentId}`
          }],
          [{
            text: "Edit Instruction",
            callback_data: `editinstruction:${response.agent.agentId}`
          }, {text: "Edit Actions", callback_data: `editactions:${response.agent.agentId}`}],
          [{text: "Edit Voice", callback_data: `editvoice:${response.agent.agentId}`},
            {text: "Edit Memory", callback_data: `editmemory:${response.agent.agentId}`}],
          [{text: "« Back to Agent", callback_data: `agent:${response.agent.agentId}`}],
        ]
      }
    }).catch((e) => console.log(e));
    return
  }
  if (data.startsWith("deleteagent:")) {
    const agentId = data.split(":")[1];
    let response;
    try {
      response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
    } catch {
      response = {
        agent: null
      }
    }
    if (!response.agent) {
      await ctx.editMessageText("Failed to get agent.", {
        reply_markup: {
          inline_keyboard: [
            [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
          ]
        }
      }).catch((e) => console.log(e));
      return;
    }
    await ctx.editMessageText(`You are about to delete your agent ${response.agent.agentName}.Is that correct?`, {
      reply_markup: {
        inline_keyboard: [
          [{text: "Nope, Never mind", callback_data: `agent:${agentId}`}],
          [{text: "Yes, delete the agent", callback_data: `deleteagent_yes:${agentId}`}],
          [{text: "No", callback_data: `agent:${agentId}`}],
          [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
        ]
      }
    }).catch((e) => console.log(e));
    return
  }
  if (data.startsWith("backtoagentlist")) {
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
    await ctx.editMessageText("Choose an agent from the list below:", {
      reply_markup: {
        inline_keyboard: inlineKeyboardRows,
      }
    }).catch((e) => console.log(e));
    return;
  }
  if (data.startsWith("prepareagent:")) {
    const agentId = data.split(":")[1];
    const response = await bedrockAgentClient.send(new PrepareAgentCommand({agentId}));
    await ctx.editMessageText(`Agent has been prepared successfully.

<b>AgentId:</b> ${response.agentId}
<b>AgentStatus:</b> ${response.agentStatus}
`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "« Back to Agent", callback_data: `agent:${response.agentId}`}],
        ]
      }
    }).catch((e) => console.log(e));
  }
  if (data.startsWith("agentsettings:")) {
    const agentId = data.split(":")[1];
    let response;
    try {
      response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
    } catch {
      response = {
        agent: null
      }
    }
    if (!response.agent) {
      await ctx.editMessageText("Failed to get agent.", {
        reply_markup: {
          inline_keyboard: [
            [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
          ]
        }
      }).catch((e) => console.log(e));
      return;
    }
    await ctx.editMessageText(`Settings for ${response.agent.agentName}.`, {
      reply_markup: {
        inline_keyboard: [
          [{text: "Basic Action", callback_data: `basicaction:${response.agent.agentId}`}, {
            text: "Psychology Action",
            callback_data: `psychologyaction:${response.agent.agentId}`
          }],
          [{text: "Telegram Bot", callback_data: `telegrambot:${response.agent.agentId}`}, {
            text: "Twitter Bot",
            callback_data: `twitterbot:${response.agent.agentId}`
          }],
          [{text: "« Back to Agent", callback_data: `agent:${response.agent.agentId}`}],
        ]
      }
    }).catch((e) => console.log(e));
  }
  if (data.startsWith("deleteagent_yes:")) {
    const agentId = data.split(":")[1];
    const agentAliasId = await redisClient.get(`agentAliasId:${agentId}`) as string | undefined
    if (agentAliasId) {
      await bedrockAgentClient.send(new DeleteAgentAliasCommand({
        agentId: agentId,
        agentAliasId: agentAliasId,
      }))
    }
    const response = await bedrockAgentClient.send(new DeleteAgentCommand({agentId}));
    await ctx.editMessageText(`Agent deleted successfully.

<b>AgentId:</b> ${response.agentId}
<b>AgentStatus:</b> ${response.agentStatus}
`, {
      reply_markup: {
        inline_keyboard: [
          [{text: "« Back to Agent List", callback_data: "backtoagentlist"}],
        ]
      },
      parse_mode: "HTML"
    }).catch((e) => console.log(e));
  }
  if (data.startsWith("editname:")) {
    const agentId = data.split(":")[1];
    await Promise.all([
      redisClient.set(`params:${ctx.from?.id}`, ["editname", agentId]),
      ctx.editMessageText("Please enter the new name for the agent."),
    ])
      .catch((e) => console.log(e));
  }
  if (data.startsWith("editdescription:")) {
    const agentId = data.split(":")[1];
    await Promise.all([
      redisClient.set(`params:${ctx.from?.id}`, ["editdescription", agentId]),
      ctx.editMessageText("Please enter the new description for the agent."),
    ])
      .catch((e) => console.log(e));
  }
  if (data.startsWith("editinstruction:")) {
    const agentId = data.split(":")[1];
    await Promise.all([
      redisClient.set(`params:${ctx.from?.id}`, ["editinstruction", agentId]),
      ctx.editMessageText("Please enter the new instruction for the agent."),
    ])
      .catch((e) => console.log(e));
  }
  if (data.startsWith("editvoice")) {
    const agentId = data.split(":")[1];
    await Promise.all([
      redisClient.set(`params:${ctx.from?.id}`, ["editvoice", agentId]),
      ctx.editMessageText("Please enter the voice name of agent."),
    ])
      .catch((e) => console.log(e));
  }
  if (data.startsWith("twitterbot")) {
    const agentId = data.split(":")[1];
    const twitter_data = await redisClient.get(`twitterbotauth2:${agentId}`) as {
      userObject: { id: string, username: string, name: string }
    } | null
    if (!twitter_data) {
      const {
        url,
        codeVerifier,
        state
      } = twitterClient.generateOAuth2AuthLink("https://open.abandon.ai/api/callback/twitter", {
        scope: ['tweet.read', 'tweet.write', 'users.read', 'like.write', 'like.read', 'offline.access'],
        state: agentId
      });
      await Promise.all([
        redisClient.pipeline()
          .set(`params:${ctx.from?.id}`, ["twitterbot", agentId])
          .set(`oauth2:${agentId}`, {
            codeVerifier,
            state,
            chatId: ctx.chat?.id,
            messageId: ctx.update.message?.message_id
          }),
        ctx.editMessageText("Please login with your Twitter account.", {
          reply_markup: {
            inline_keyboard: [
              [{text: "Login with Twitter", url: url}],
              [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
            ]
          }
        })
      ])
        .catch((e) => console.log(e));
    } else {
      const { userObject } = twitter_data
      await ctx.editMessageText(`This agent have login with <a href="https://x.com/${userObject.username}">${userObject.name}</a>`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "Logout", callback_data: `logouttwitter:${agentId}`}],
            [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
          ]
        }
      }).catch((e) => console.log(e));
    }
  }
  if (data.startsWith("telegrambot")) {
    const agentId = data.split(":")[1];
    const token = await redisClient.get(`telegrambottoken:${agentId}`)
    if (!token) {
      await Promise.all([
        redisClient.set(`params:${ctx.from?.id}`, ["telegrambot", agentId]),
        ctx.editMessageText("Please enter the telegram bot token for the agent.")
      ])
        .catch((e) => console.log(e));
      return;
    }
    const me = await fetch(`https://api.telegram.org/bot${token}/getMe`).then((res) => res.json())
    await ctx.editMessageText(`Here it is @${me.result.username}`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Update Action", callback_data: `updatetelegramaction:${agentId}`}],
          [{text: "Logout", callback_data: `logouttelegram:${agentId}`}],
          [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
        ]
      }
    })
  }
  if (data.startsWith("basicaction")) {
    const agentId = data.split(":")[1];
    await ctx.editMessageText(`You can update agent basic action`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Update Action", callback_data: `updatebasicaction:${agentId}`}],
          [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
        ]
      }
    })
  }
  if (data.startsWith("psychologyaction")) {
    const agentId = data.split(":")[1];
    await ctx.editMessageText(`You can update agent psychology action`, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{text: "Update Action", callback_data: `updatepsychologyaction:${agentId}`}],
          [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
        ]
      }
    })
  }
  if (data.startsWith("logouttwitter")) {
    const agentId = data.split(":")[1];
    await Promise.all([
      redisClient.del(`twitterbotauth2:${agentId}`),
      ctx.editMessageText("Twitter logout successfully.", {
        reply_markup: {
          inline_keyboard: [
            [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
          ]
        }
      })
    ])
      .catch((e) => console.log(e));
  }
  if (data.startsWith("logouttelegram")) {
    const agentId = data.split(":")[1];
    const token = await redisClient.get(`telegrambottoken:${agentId}`);
    await deleteTelegramAction(agentId, bedrockAgentClient);
    await Promise.all([
      fetch(`https://api.telegram.org/bot${token}/deleteWebhook`),
      redisClient.del(`telegrambottoken:${agentId}`),
      ctx.editMessageText("Telegram bot logout successfully.", {
        reply_markup: {
          inline_keyboard: [
            [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
          ]
        }
      })
    ])
      .catch((e) => console.log(e));
  }
  if (data.startsWith("updatetelegramaction")) {
    const agentId = data.split(":")[1];
    await updateTelegramAction(agentId, bedrockAgentClient);
    await ctx.editMessageText("Telegram action updated successfully.", {
      reply_markup: {
        inline_keyboard: [
          [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
        ]
      }
    }).catch((e) => console.log(e));
  }
  if (data.startsWith("updatepsychologyaction")) {
    const agentId = data.split(":")[1];
    await updatePsychologyAction(agentId, bedrockAgentClient);
    await ctx.editMessageText("Psychology action updated successfully.", {
      reply_markup: {
        inline_keyboard: [
          [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
        ]
      }
    }).catch((e) => console.log(e));
  }
  if (data.startsWith("updatebasicaction")) {
    const agentId = data.split(":")[1];
    await updateBasicAction(agentId, bedrockAgentClient);
    await ctx.editMessageText("Basic action updated successfully.", {
      reply_markup: {
        inline_keyboard: [
          [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
        ]
      }
    }).catch((e) => console.log(e));
  }
  if (data.startsWith("newversion")) {
    const agentId = data.split(":")[1];
    const oldAgentAliasId = await redisClient.get(`agentAliasId:${agentId}`) as string | undefined
    if (oldAgentAliasId) {
      await bedrockAgentClient.send(new DeleteAgentAliasCommand({
        agentId: agentId,
        agentAliasId: oldAgentAliasId,
      })).catch((e) => console.log(e))
    }
    const response = await bedrockAgentClient.send(new CreateAgentAliasCommand({
      agentId: agentId,
      agentAliasName: Date.now().toString(),
    })).catch((e) => console.log(e))
    if (response?.agentAlias?.agentAliasId) {
      await redisClient.set(`agentAliasId:${agentId}`, response?.agentAlias?.agentAliasId)
      await ctx.editMessageText(`New version created successfully.`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
          ]
        }
      }).catch((e) => console.log(e));
    } else {
      await ctx.editMessageText(`Failed to create new version.`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{text: "« Back to Agent", callback_data: `agent:${agentId}`}],
          ]
        }
      }).catch((e) => console.log(e));
    }
  }
});

bot.on("message", async (ctx) => {
  const params = await redisClient.get(`params:${ctx.from?.id}`) as string[] | undefined;
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
        await redisClient.set(`params:${ctx.from?.id}`, ["newagent", agentName]);
        await ctx.reply("Please enter the instruction for your agent.");
      } else if (params.length === 2) {
        const agentName = params[1];
        const instruction = ctx.message.text;
        if (!instruction) {
          await ctx.reply("Please enter the instruction for your agent.");
          return;
        }
        await redisClient.set(`params:${ctx.from?.id}`, ["newagent", agentName, instruction]);
        const roleArn = `arn:aws:iam::913870644571:role/service-role/AmazonBedrockExecutionRoleForAgents_FJ2B7VCI69D`;
        const response = await bedrockAgentClient.send(new CreateAgentCommand({
          agentName: agentName,
          instruction: instruction,
          foundationModel: "anthropic.claude-3-5-sonnet-20241022-v2:0",
          agentResourceRoleArn: roleArn,
        }));
        if (!response.agent) {
          await ctx.reply("Failed to create agent.");
          return;
        } else {
          await redisClient.del(`params:${ctx.from?.id}`);
          await ctx.reply(`Agent created successfully.

<b>AgentId:</b> ${response.agent.agentId}
<b>AgentName:</b> ${response.agent.agentName}
<b>AgentStatus:</b> ${response.agent.agentStatus}
<b>FoundationModel:</b> ${response.agent.foundationModel}
`, {
            parse_mode: "HTML",
          })
        }
      }
    }
    if (params[0] === "deleteagent") {
      if (params.length === 1) {
        const agentId = ctx.message.text;
        const response = await bedrockAgentClient.send(new DeleteAgentCommand({agentId}));
        await redisClient.del(`params:${ctx.from?.id}`);
        await ctx.reply(`Agent deleted successfully.

<b>AgentId:</b> ${response.agentId}
<b>AgentStatus:</b> ${response.agentStatus}
`, {
          parse_mode: "HTML",
        })
      }
    }
    if (params[0] === "editname") {
      if (params.length === 2) {
        const agentId = params[1];
        const agentName = ctx.message.text;
        if (!agentName) {
          await ctx.reply("Please enter the new name for the agent.");
          return;
        }
        let _response;
        try {
          _response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
        } catch {
          _response = {
            agent: null
          }
        }
        if (!_response.agent) {
          await ctx.reply("Failed to get agent.");
          return;
        }
        const {agent} = _response;
        const response = await bedrockAgentClient.send(new UpdateAgentCommand({
          agentId: agent.agentId,
          agentName: agentName,
          instruction: agent.instruction,
          foundationModel: agent.foundationModel,
          description: agent.description,
          agentResourceRoleArn: agent.agentResourceRoleArn,
          guardrailConfiguration: agent.guardrailConfiguration,
          memoryConfiguration: agent.memoryConfiguration,
          agentCollaboration: agent.agentCollaboration,
        }));
        await bedrockAgentClient.send(new PrepareAgentCommand({agentId})).catch((e) => console.log(e));
        if (!response.agent) {
          await ctx.reply("Failed to update agent.");
          return;
        }
        await redisClient.del(`params:${ctx.from?.id}`);
        await ctx.reply(`Agent name updated successfully.

<b>AgentId:</b> ${response.agent.agentId}
<b>AgentName:</b> ${response.agent.agentName}
<b>AgentStatus:</b> ${response.agent.agentStatus}
`, {
          parse_mode: "HTML",
        })
      }
    }
    if (params[0] === "editdescription") {
      if (params.length === 2) {
        const agentId = params[1];
        const description = ctx.message.text;
        if (!description) {
          await ctx.reply("Please enter the new description for the agent.");
          return;
        }
        let _response;
        try {
          _response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
        } catch {
          _response = {
            agent: null
          }
        }
        if (!_response.agent) {
          await ctx.reply("Failed to get agent.");
          return;
        }
        const {agent} = _response;
        const response = await bedrockAgentClient.send(new UpdateAgentCommand({
          agentId: agent.agentId,
          agentName: agent.agentName,
          instruction: agent.instruction,
          foundationModel: agent.foundationModel,
          description: description,
          agentResourceRoleArn: agent.agentResourceRoleArn,
          guardrailConfiguration: agent.guardrailConfiguration,
          memoryConfiguration: agent.memoryConfiguration,
          agentCollaboration: agent.agentCollaboration,
        }));
        await bedrockAgentClient.send(new PrepareAgentCommand({agentId})).catch((e) => console.log(e));
        if (!response.agent) {
          await ctx.reply("Failed to update agent.");
          return;
        }
        await redisClient.del(`params:${ctx.from?.id}`);
        await ctx.reply(`Agent description updated successfully.

<b>AgentId:</b> ${response.agent.agentId}
<b>AgentName:</b> ${response.agent.agentName}
<b>AgentStatus:</b> ${response.agent.agentStatus}
<b>Description:</b> ${response.agent.description}
`, {
          parse_mode: "HTML",
        })
      }
    }
    if (params[0] === "editvoice") {
      const agentId = params[1];
      const voice = ctx.message.text;
      await redisClient.set(`voice:${agentId}`, voice);
      await ctx.reply("Voice updated successfully.");
    }
    if (params[0] === "editinstruction") {
      if (params.length === 2) {
        const agentId = params[1];
        const instruction = ctx.message.text;
        if (!instruction) {
          await ctx.reply("Please enter the new instruction for the agent.");
          return;
        }
        let _response;
        try {
          _response = await bedrockAgentClient.send(new GetAgentCommand({agentId}));
        } catch {
          _response = {
            agent: null
          }
        }
        if (!_response.agent) {
          await ctx.reply("Failed to get agent.");
          return;
        }
        const {agent} = _response;
        const response = await bedrockAgentClient.send(new UpdateAgentCommand({
          agentId: agent.agentId,
          agentName: agent.agentName,
          instruction: instruction,
          foundationModel: agent.foundationModel,
          description: agent.description,
          agentResourceRoleArn: agent.agentResourceRoleArn,
          guardrailConfiguration: agent.guardrailConfiguration,
          memoryConfiguration: agent.memoryConfiguration,
          agentCollaboration: agent.agentCollaboration,
        }));
        await bedrockAgentClient.send(new PrepareAgentCommand({agentId})).catch((e) => console.log(e));
        if (!response.agent) {
          await ctx.reply("Failed to update agent.");
          return;
        }
        await redisClient.del(`params:${ctx.from?.id}`);
        await ctx.reply(`Agent instruction updated successfully.

<b>AgentId:</b> ${response.agent.agentId}
<b>AgentName:</b> ${response.agent.agentName}
<b>AgentStatus:</b> ${response.agent.agentStatus}
<b>Instruction:</b> ${response.agent.instruction}
`, {
          parse_mode: "HTML",
        })
      }
    }
    if (params[0] === "telegrambot") {
      if (params.length === 2) {
        const agentId = params[1];
        const token = ctx.message.text;
        await updateTelegramAction(agentId, bedrockAgentClient);
        await bedrockAgentClient.send(new PrepareAgentCommand({agentId})).catch((e) => console.log(e));
        // 存储 token，便于 agent 后续获取到 token 来发送信息
        await redisClient.set(`telegrambottoken:${agentId}`, token);
        await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: `https://open.abandon.ai/api/bot/tenant/${agentId}`
          })
        });
        await redisClient.del(`params:${ctx.from?.id}`);
        await ctx.reply(`Telegram bot token updated successfully.

<b>AgentId:</b> ${agentId}
<b>Token:</b> <code>${token}</code>
`, {
          parse_mode: "HTML",
        })
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