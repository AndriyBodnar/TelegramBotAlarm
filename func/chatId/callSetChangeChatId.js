import { counterForDb } from "../../database/counter.js";
import {
  getInfoFirebase,
  addChatFirebase,
  setValueFirebase,
} from "../../database/firebaseRequest.js";
import { callSetChangeChatIdEnum } from "../../enums/callSetChangeChatId.enum.js";
import { bot, state } from "../../index.js";
import { timeAlarmMap } from "../alarm/alarmAlert.js";

let { COMMAND, SELECT, YOUR_SELECT } = callSetChangeChatIdEnum;

export async function callSetChangeChatId(text, chatId, msgId) {
  if (state.chatsID === null) state.chatsID = { "Львівська область": [] };

  let statesUkraineKeyboard = state.statesOfUkraine.map((el) => {
    return [el];
  });

  if (
    state.statesOfUkraine.includes(text) &&
    !Object.values(state.chatsID).flat().includes(chatId)
  ) {
    await bot.sendMessage(chatId, YOUR_SELECT + text, {
      parse_mode: `HTML`,
      reply_markup: {
        remove_keyboard: true,
      },
    });
    if (text === "Київ") await timeAlarmMap(chatId, msgId, "м. Київ");
    else await timeAlarmMap(chatId, msgId, text);
    await addChatFirebase(text, chatId);
    await getInfoFirebase("chatsID");
  }

  if (text.includes(COMMAND)) {
    await counterForDb(callSetChangeChatId.name, chatId);

    for (let id in state.chatsID) {
      if (state.chatsID[id].includes(chatId)) {
        state.chatsID[id].splice(state.chatsID[id].indexOf(chatId), 1);

        // deleteChatFirebase(id, state.chatsID[id]);
        setValueFirebase(state.chatsID, id, state.chatsID[id], "chatsID");

        await bot.sendMessage(chatId, SELECT, {
          parse_mode: `HTML`,
          reply_markup: JSON.stringify({
            keyboard: [...statesUkraineKeyboard],
          }),
        });
        await getInfoFirebase("chatsID");
      }
    }
  }

  if (
    !text.includes("/deadstat") &&
    !Object.values(state.chatsID).flat().includes(chatId) &&
    !text.includes(COMMAND)
  ) {
    await bot.sendMessage(chatId, SELECT, {
      parse_mode: `HTML`,
      reply_markup: JSON.stringify({
        keyboard: [...statesUkraineKeyboard],
      }),
    });
  }
}
