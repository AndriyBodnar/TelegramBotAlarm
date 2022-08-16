import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import { fork } from "node:child_process";
import { testAlarm, timeAlarmMap } from "./func/alarm/alarmAlert.js";
import {
  addChatFirebase,
  commandsFirebase,
  deleteChatFirebase,
  getInfoFirebase,
} from "./func/database/firebaseRequest.js";

process.env["NTBA_FIX_350"] = 1;

export let bot;

let state = {
  // from firebase
  requestInterval: {
    requestAlarm: {},
  },
};

export let statesOfUkraine = [
  "Вінницька область",
  "Волинська область",
  "Дніпропетровська область",
  "Донецька область",
  "Житомирська область",
  "Закарпатська область",
  "Запорізька область",
  "Івано-Франківська область",
  "Київська область",
  "Кіровоградська область",
  "Луганська область",
  "Львівська область",
  "Миколаївська область",
  "Одеська область",
  "Полтавська область",
  "Рівненська область",
  "Сумська область",
  "Тернопільська область",
  "Харківська область",
  "Херсонська область",
  "Хмельницька область",
  "Черкаська область",
  "Чернівецька область",
  "Чернігівська область",
  "Київ",
];

let statesUkraine = statesOfUkraine.map((el) => {
  return [el];
});

try {
  bot = new TelegramBot(process.env.TOKEN, { polling: true });
} catch (err) {
  console.error(err);
}

const start = async () => {
  //   await testAlarmStates();
  await getInfoFirebase(state, "chatsID");

  await commandsFirebase(state);

  fork("./func/alarm/alarmMap.js");
  cron.schedule("*/10 * * * * *", () => testAlarm(state, bot, state.chatsID), {
    timezone: "Europe/Kiev",
  });

  bot.on("message", async (msg) => {
    const { text, message_id: msgId } = msg;
    const { id: chatId } = msg.chat;
    const { first_name: firstName, username: userName } = msg.from;

    ///////////////////////////////////

    if (text !== undefined) {
      if (
        statesUkraine.flat().includes(text) &&
        !Object.values(state.chatsID).flat().includes(chatId)
      ) {
        await bot.sendMessage(chatId, `Your state is: ${text}`, {
          parse_mode: `HTML`,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        await addChatFirebase(state.chatsID, text, chatId);
        await getInfoFirebase(state, "chatsID");
      }

      if (text !== undefined && text.includes("/change_state")) {
        for (let el in state.chatsID) {
          if (state.chatsID[el].includes(chatId)) {
            state.chatsID[el].splice(state.chatsID[el].indexOf(chatId), 1);
            let arr = state.chatsID[el];

            deleteChatFirebase(state.chatsID, el, arr);

            await bot.sendMessage(chatId, "Select state:", {
              parse_mode: `HTML`,
              reply_markup: JSON.stringify({
                keyboard: [...statesUkraine],
              }),
            });
            await getInfoFirebase(state, "chatsID");
            console.log(
              "🚀 ~ file: index.js ~ line 111 ~ bot.on ~ state",
              state.chatsID
            );
          }
        }
      }

      if (
        !Object.values(state.chatsID).flat().includes(chatId) &&
        !text.includes("/change_state")
      ) {
        await bot.sendMessage(chatId, "Select state:", {
          parse_mode: `HTML`,
          reply_markup: JSON.stringify({
            keyboard: [...statesUkraine],
          }),
        });
      }

      ///////////////////////////////////
      let alarmInterval = state.requestInterval.requestAlarm;

      if (
        !alarmInterval[`${chatId}`] &&
        (text.includes("/alarm") || text.toLowerCase() === "air alarm")
      ) {
        // alarmInterval[`${chatId}`] = true;
        // setTimeout(() => {
        //   alarmInterval[`${chatId}`] = false;
        // }, 60000);

        let alarmState;

        for (let el in state.chatsID) {
          if (state.chatsID[el].includes(chatId)) alarmState = el;
        }

        console.log(alarmState);

        return await timeAlarmMap(bot, chatId, msgId, alarmState);
      }
    }
  });
  console.log(state);
  bot.on("callback_query", async (msg) => {});
  bot.on("polling_error", (msg) => console.log(msg));
};

start();
