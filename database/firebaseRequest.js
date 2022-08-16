import axios from "axios";
import { bot, state } from "../index.js";

const instance = axios.create({
  //withCredentials: true,
  baseURL: `https://alarmbot-867dc-default-rtdb.europe-west1.firebasedatabase.app`,
  headers: {
    Connection: "keep-alive",
    "Accept-Encoding": "",
  },
});

export async function getInfoFirebase(prop) {
  await instance.get(`${prop}.json`).then((res) => {
    state[prop] = res.data;
  });
}

export async function addChatFirebase(obl, chatId = null) {
  await instance.put(
    `chatsID.json`,
    state.chatsID[obl] == null
      ? { ...state.chatsID, [`${obl}`]: [chatId] }
      : { ...state.chatsID, [`${obl}`]: [...state.chatsID[obl], chatId] }
  );
}

export async function deleteChatFirebase(obl, arr) {
  await instance.put(`chatsID.json`, { ...state.chatsID, [`${obl}`]: arr });
}

export async function setValueEnableAlarm(state, a, b) {
  await instance.put(`enableAlarm.json`, { ...state, [a]: b });
}

export async function commandsFirebase() {
  await getInfoFirebase("commands");
  await bot.setMyCommands(state.commands);
}

export async function allState() {
  await getInfoFirebase("statesOfUkraine");
  await getInfoFirebase("chatsID");
  await getInfoFirebase("enableAlarm");
  await commandsFirebase();
}
