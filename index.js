import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import { fork } from "node:child_process";
import { testAlarm } from "./func/alarm/alarmAlert.js";
import { allState } from "./database/firebaseRequest.js";
import { callTimeAlarmMap } from "./func/alarm/callTimeAlarmMap.js";
import { callSetChangeChatId } from "./func/chatId/callSetChangeChatId.js";
import { callDeadStat } from "./func/deadstat/callDeadStat.js";

process.env["NTBA_FIX_350"] = 1;

export let bot;

export let state = {
  dead: { Особовийсклад: { count: null, add: null } },
  requestInterval: {
    requestAlarm: {},
  },
};

try {
  bot = new TelegramBot(process.env.TOKEN, { polling: true });
} catch (err) {
  console.error(err);
}

const start = async () => {
  console.log(process.env.npm_package_version);

  await allState();

  fork("./func/alarm/alarmMap.js");
  cron.schedule("*/10 * * * * *", () => testAlarm(), {
    timezone: "Europe/Kiev",
  });

  bot.on("message", async (msg) => {
    const { text, message_id: msgId } = msg;
    const { id: chatId } = msg.chat;
    const { first_name: firstName, username: userName } = msg.from;

    if (text !== undefined) {
      await callSetChangeChatId(text, chatId, msgId);

      await callTimeAlarmMap(text, chatId, msgId);

      await callDeadStat(text, chatId, msgId);
    }
  });

  bot.on("callback_query", async (msg) => {});
  bot.on("polling_error", (msg) => {
    bot.sendMessage(408965128, msg);
  });
};

start();
