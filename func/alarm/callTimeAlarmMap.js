import { counterForDb } from "../../database/counter.js";
import { callTimeAlarmMapEnum } from "../../enums/callTimeAlarmMap.enum.js";
import { state } from "../../index.js";
import { delay } from "../helpFunction/helpFunc.js";
import { timeAlarmMap } from "./alarmAlert.js";
let { COMMAND, TEXT_COMMAND } = callTimeAlarmMapEnum;

export async function callTimeAlarmMap(text, chatId, msgId) {
  let alarmInterval = state.requestInterval.requestAlarm;

  if (
    
    Object.values(state.chatsID).flat().includes(chatId) &&
    !alarmInterval[`${chatId}`] &&
    (text.includes(COMMAND) || text.toLowerCase() === TEXT_COMMAND)
  ) {
    await counterForDb(callTimeAlarmMap.name, chatId);
    let alarmState;

    // alarmInterval[`${chatId}`] = true;
    // setTimeout(() => {
    //   alarmInterval[`${chatId}`] = false;
    // }, 30000);

    for (let el in state.chatsID) {
      if (state.chatsID[el].includes(chatId)) {
        if (el === "Київ") alarmState = "м. Київ";
        else alarmState = el;
      }
    }

    return await timeAlarmMap(chatId, msgId, alarmState);
  }

  //   if (
  //     alarmInterval[`${chatId}`] &&
  //     (text.includes("/alarm") || text.toLowerCase() === "air alarm")
  //   ) {
  //     await delay(2000);
  //     return bot.deleteMessage(chatId, msgId).catch((e) => null);
  //   }
}
