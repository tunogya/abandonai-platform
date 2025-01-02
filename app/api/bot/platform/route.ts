export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import {Bot, webhookCallback} from 'grammy'

const token = process.env.TELEGRAM_BOT_TOKEN

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')

const bot = new Bot(token)

bot.command("start", async (ctx) => {
  await ctx.reply(JSON.stringify(ctx));
});

/**
 * command - newagent
 *
 * command - myagents
 */

/**
 * Edit Agent
 *
 * ...
 *
 * command - deleteagent
 */

/**
 * Agent Settings
 *
 * command -
 */

/**
 * Knowledge bases
 */



export const POST = webhookCallback(bot, 'std/http')