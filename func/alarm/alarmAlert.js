import axios from "axios";

import moment from "moment";
import { statesOfUkraine } from "../../index.js";
import {
  getInfoFirebase,
  setValueEnableAlarm,
} from "../database/firebaseRequest.js";
import { axiosHelp, getWatch } from "../helpFunction/helpFunc.js";

moment.locale("UK");

async function alarmSendMessage(msg, bot, chatsID, voice) {
  if (!!chatsID) {
    for (let el of chatsID) {
      await bot
        .sendAudio(el, voice, {
          caption: msg,
        })
        .catch((e) => console.log(e));
    }
  }
}

export async function testAlarm(state, bot, chatsID) {
  let obj = {};

  await getInfoFirebase(state, "enableAlarm");

  let responseAlarm = await axiosHelp(
    `https://emapa.fra1.cdn.digitaloceanspaces.com/statuses.json`
  );

  Object.keys(responseAlarm.states).forEach((el) => {
    if (el.includes("."))
      return (obj[`${"Київ"}`] = responseAlarm.states[`${el}`].enabled);
    return (obj[`${el}`] = responseAlarm.states[`${el}`].enabled);
  });

  statesOfUkraine.forEach((el) => {
    if (!state.enableAlarm[`${el}`] && obj[`${el}`]) {
      state.enableAlarm[`${el}`] = obj[`${el}`];

      setValueEnableAlarm(state.enableAlarm, el, obj[`${el}`]);
      alarmSendMessage(
        `🚨ПОВІТРЯНА ТРИВОГА ${el}!🚨`,
        bot,
        chatsID[`${el}`],
        `./assets/voice-messages/alarm.ogg`
      );

      return state.enableAlarm.value;
    }
    if (state.enableAlarm[`${el}`] && !obj[`${el}`]) {
      state.enableAlarm[`${el}`] = obj[`${el}`];

      setValueEnableAlarm(state.enableAlarm, el, obj[`${el}`]);
      alarmSendMessage(
        `🟢ВІДБІЙ ТРИВОГИ!🟢 ${el}`,
        bot,
        chatsID[`${el}`],
        `./assets/voice-messages/cancelAlarm.ogg`
      );
      return state.enableAlarm.value;
    }
  });
}

export async function timeAlarmMap(bot, chatId, msgId, alarmState) {
  bot.sendChatAction(chatId, "upload_photo");
  const { data } = await axios.get(
    `https://emapa.fra1.cdn.digitaloceanspaces.com/statuses.json`
  );
  let response = data.states[alarmState];
  let time = moment(moment(response.enabled_at)).format("LT");
  let timeEnd = moment(moment(response.disabled_at)).format("LLL");

  if (response.enabled_at) {
    let min = Math.floor(
      (Date.now() - new Date(response.enabled_at).getTime() / (1000 * 60)) % 60
    );

    await bot.sendPhoto(chatId, "assets/img/screenshotMap.png", {
      caption: `Тривога почалась о ${time}  у ${alarmState},  і триває ${(
        (Date.now() - new Date(response.enabled_at).getTime()) /
        60000
      ).toFixed(0)} min ${getWatch(min)}`,
      reply_to_message_id: msgId,
    });
  } else {
    let t = Date.now() - new Date(response.disabled_at).getTime(),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      min = Math.floor((t / (1000 * 60)) % 60);

    await bot.sendPhoto(chatId, "assets/img/screenshotMap.png", {
      caption: `🔕Тривоги немає у ${alarmState}!🔕
Остання тривога ${timeEnd} 
${
  days === 0
    ? hours === 0
      ? `${min}min ${getWatch(min)}`
      : `${hours}hour ${min}min ${getWatch(min)}`
    : `${days}day ${hours}hour ${min}min ${getWatch(min)}`
}

  `,
      reply_to_message_id: msgId,
    });
  }
}
