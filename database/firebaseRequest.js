import axios from "axios";
import "dotenv/config";
import { bot, state } from "../index.js";

const instance = axios.create({
  //withCredentials: true,
  baseURL:
    "https://alarmbot-867dc-default-rtdb.europe-west1.firebasedatabase.app",
  headers: {
    Connection: "keep-alive",
    "Accept-Encoding": "",
  },
   params: { auth: process.env.AUTH } 
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

export async function setValueFirebase(state, prop, value, nameValue) {
  await instance.put(`${nameValue}.json`, { ...state, [`${prop}`]: value });
  await getInfoFirebase(nameValue);
}

export async function commandsFirebase() {
  await getInfoFirebase("commands");
  await bot.setMyCommands(state.commands);
}

export async function setValueCounter(
  state,
  funcName,
  value,
  chatId,
  valueChatId
) {
  await instance.put(`counter/${funcName}.json`, {
    ...state,
    value,
    [chatId]: valueChatId,
  });
}

export async function allState() {
  await getInfoFirebase("statesOfUkraine");
  await getInfoFirebase("chatsID");
  await getInfoFirebase("enableAlarm");
  await getInfoFirebase("counter");
  await getInfoFirebase("deadState");
  await commandsFirebase();
}
